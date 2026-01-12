import { useState } from 'react';
import { Modal, Button, TextInput, Textarea, Stack, Text, Checkbox, Group, ScrollArea, Loader, Box, Tabs } from '@mantine/core';
import { IconMail, IconSend, IconEye, IconCode } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import { usersApi } from '../api/client';

// Простой рендер markdown для предпросмотра
const renderMarkdown = (markdown) => {
  let html = markdown;
  
  // Заголовки
  html = html.replace(/^######\s+(.+)$/gm, '<h6 style="font-size: 12px; font-weight: 600; color: #9ca3af; margin: 10px 0 6px 0;">$1</h6>');
  html = html.replace(/^#####\s+(.+)$/gm, '<h5 style="font-size: 14px; font-weight: 600; color: #6b7280; margin: 12px 0 6px 0;">$1</h5>');
  html = html.replace(/^####\s+(.+)$/gm, '<h4 style="font-size: 16px; font-weight: 600; color: #4b5563; margin: 14px 0 8px 0;">$1</h4>');
  html = html.replace(/^###\s+(.+)$/gm, '<h3 style="font-size: 18px; font-weight: 600; color: #374151; margin: 16px 0 8px 0;">$1</h3>');
  html = html.replace(/^##\s+(.+)$/gm, '<h2 style="font-size: 20px; font-weight: 600; color: #1f2937; margin: 18px 0 10px 0;">$1</h2>');
  html = html.replace(/^#\s+(.+)$/gm, '<h1 style="font-size: 24px; font-weight: 700; color: #fff; margin: 20px 0 12px 0;">$1</h1>');
  
  // Горизонтальная линия
  html = html.replace(/^([-*_]){3,}\s*$/gm, '<hr style="border: none; border-top: 2px solid #27272A; margin: 20px 0;">');
  
  // Жирный и курсив
  html = html.replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>');
  html = html.replace(/___(.+?)___/g, '<strong><em>$1</em></strong>');
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/__(.+?)__/g, '<strong>$1</strong>');
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');
  html = html.replace(/_(.+?)_/g, '<em>$1</em>');
  html = html.replace(/~~(.+?)~~/g, '<del style="color: #9ca3af;">$1</del>');
  
  // Код
  html = html.replace(/```([\s\S]*?)```/g, '<pre style="background: #1f2937; padding: 12px; border-radius: 6px; overflow-x: auto; margin: 12px 0;"><code style="color: #10b981; font-size: 13px;">$1</code></pre>');
  html = html.replace(/`([^`]+)`/g, '<code style="background: #27272A; padding: 2px 6px; border-radius: 3px; color: #dc2626; font-size: 13px;">$1</code>');
  
  // Ссылки
  html = html.replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" style="color: #8b5cf6; text-decoration: underline;">$1</a>');
  
  // Списки
  html = html.replace(/^\*\s+(.+)$/gm, '<li>$1</li>');
  html = html.replace(/^-\s+(.+)$/gm, '<li>$1</li>');
  html = html.replace(/(<li>.*<\/li>\n?)+/g, '<ul style="margin: 12px 0; padding-left: 24px;">$&</ul>');
  
  html = html.replace(/^\d+\.\s+(.+)$/gm, '<li>$1</li>');
  
  // Цитаты
  html = html.replace(/^>\s+(.+)$/gm, '<blockquote style="border-left: 4px solid #8b5cf6; padding-left: 16px; margin: 16px 0; color: #9ca3af; font-style: italic;">$1</blockquote>');
  
  // Параграфы
  html = html.replace(/\n\n/g, '</p><p style="margin: 12px 0;">');
  html = html.replace(/\n/g, '<br>');
  
  return `<p style="margin: 12px 0;">${html}</p>`;
};

export default function BulkEmailModal({ opened, onClose, users }) {
  const [selectedUserIds, setSelectedUserIds] = useState([]);
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [sending, setSending] = useState(false);
  const [activeTab, setActiveTab] = useState('edit');

  const toggleUser = (userId) => {
    setSelectedUserIds(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const selectAll = () => {
    setSelectedUserIds(users.map(u => u._id));
  };

  const deselectAll = () => {
    setSelectedUserIds([]);
  };

  const handleSend = async () => {
    if (selectedUserIds.length === 0) {
      notifications.show({
        title: 'Ошибка',
        message: 'Выберите хотя бы одного пользователя',
        color: 'red',
      });
      return;
    }

    if (!subject.trim() || !content.trim()) {
      notifications.show({
        title: 'Ошибка',
        message: 'Заполните тему и содержание письма',
        color: 'red',
      });
      return;
    }

    setSending(true);
    try {
      const result = await usersApi.sendBulkEmail(selectedUserIds, subject, content);
      notifications.show({
        title: 'Успешно',
        message: `Отправлено ${result.successful} из ${result.total} писем`,
        color: 'green',
      });
      
      // Очистить форму
      setSelectedUserIds([]);
      setSubject('');
      setContent('');
      onClose();
    } catch (error) {
      console.error('Error sending bulk email:', error);
      notifications.show({
        title: 'Ошибка',
        message: error.response?.data?.message || error.message || 'Не удалось отправить письма',
        color: 'red',
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={
        <Group gap="xs">
          <IconMail size={20} color="#8B5CF6" />
          <Text fw={600}>Массовая отправка Email</Text>
        </Group>
      }
      size="xxl"
      styles={{
        title: {
          fontWeight: 600,
          fontSize: '18px',
        },
        body: {
          padding: '24px',
          maxHeight: '90vh',
          overflowY: 'auto',
        },
      }}
    >
      <Group align="flex-start" gap="lg" style={{ flexWrap: 'nowrap' }}>
        {/* Левая колонка - Получатели */}
        <Box style={{ width: '240px', flexShrink: 0 }}>
          <Text size="sm" fw={600} c="#FFFFFF" mb="xs">
            Получатели ({selectedUserIds.length} из {users.length})
          </Text>

          <Group gap="xs" mb="sm">
            <Button 
              size="xs" 
              variant="light" 
              color="violet"
              onClick={selectAll}
              style={{ flex: 1 }}
            >
              Выбрать всех
            </Button>
            <Button 
              size="xs" 
              variant="subtle" 
              color="gray"
              onClick={deselectAll}
              style={{ flex: 1 }}
            >
              Снять выбор
            </Button>
          </Group>

          <ScrollArea h={500} style={{
            backgroundColor: '#18181B',
            border: '1px solid #27272A',
            borderRadius: '8px',
            padding: '12px',
          }}>
            <Stack gap="xs">
              {users.map(user => (
                <Checkbox
                  key={user._id}
                  checked={selectedUserIds.includes(user._id)}
                  onChange={() => toggleUser(user._id)}
                  label={
                    <Box ml={8}>
                      <Text size="sm" c="#FFFFFF" style={{ lineHeight: 1.4 }}>
                        {user.email}
                      </Text>
                      <Text size="xs" c="dimmed" style={{ lineHeight: 1.2 }}>
                        {user.appType} • {user.role}
                      </Text>
                    </Box>
                  }
                  styles={{
                    root: { 
                      padding: '8px',
                      borderRadius: '6px',
                      '&:hover': {
                        backgroundColor: '#27272A',
                      },
                    },
                    label: { 
                      cursor: 'pointer',
                      width: '100%',
                    },
                    body: {
                      alignItems: 'flex-start',
                    },
                  }}
                />
              ))}
            </Stack>
          </ScrollArea>
        </Box>

        {/* Правая колонка - Тема и Содержание */}
        <Box style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', height: '600px' }}>
          {/* Тема */}
          <Box style={{ flexShrink: 0 }}>
            <Text size="sm" fw={600} c="#FFFFFF" mb="xs">
              Тема письма
            </Text>
            <TextInput
              placeholder="Введите тему..."
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
              styles={{
                input: {
                  backgroundColor: '#18181B',
                  border: '1px solid #27272A',
                  color: '#FFFFFF',
                  '&:focus': {
                    borderColor: '#8B5CF6',
                  },
                },
              }}
            />
          </Box>

          {/* Содержание (Markdown) с табами */}
          <Box style={{ flex: 1, display: 'flex', flexDirection: 'column', marginTop: '16px', minHeight: 0 }}>
            <Text size="sm" fw={600} c="#FFFFFF" mb="xs" style={{ flexShrink: 0 }}>
              Содержание (поддерживает Markdown)
            </Text>
            
            <Tabs value={activeTab} onChange={setActiveTab} style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
              <Tabs.List style={{ flexShrink: 0 }}>
                <Tabs.Tab value="edit" leftSection={<IconCode size={16} />}>
                  Редактор
                </Tabs.Tab>
                <Tabs.Tab value="preview" leftSection={<IconEye size={16} />}>
                  Предпросмотр
                </Tabs.Tab>
              </Tabs.List>

              <Tabs.Panel value="edit" pt="md" style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
                <Textarea
                  placeholder={`# Заголовок 1
## Заголовок 2

**Жирный текст** или __жирный__
*Курсив* или _курсив_
***Жирный и курсив***
~~Зачеркнутый~~

- Список
- Пунктов

1. Нумерованный
2. Список

[Ссылка](https://example.com)
\`код\`

> Цитата

---

\`\`\`
Блок кода
\`\`\``}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  required
                  styles={{
                    root: {
                      flex: 1,
                      display: 'flex',
                      flexDirection: 'column',
                    },
                    wrapper: {
                      flex: 1,
                      display: 'flex',
                    },
                    input: {
                      backgroundColor: '#18181B',
                      border: '1px solid #27272A',
                      color: '#FFFFFF',
                      fontFamily: 'ui-monospace, "Cascadia Code", "Source Code Pro", Menlo, monospace',
                      fontSize: '13px',
                      lineHeight: '1.6',
                      height: '100%',
                      '&:focus': {
                        borderColor: '#8B5CF6',
                      },
                    },
                  }}
                />
                <Text size="xs" c="dimmed" mt="xs" style={{ lineHeight: 1.4, flexShrink: 0 }}>
                  Поддержка: **жирный**, *курсив*, ~~зачеркнутый~~, # заголовки, списки, `код`, цитаты, ссылки
                </Text>
              </Tabs.Panel>

              <Tabs.Panel value="preview" pt="md" style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
                <Box
                  style={{
                    backgroundColor: '#18181B',
                    border: '1px solid #27272A',
                    borderRadius: '8px',
                    padding: '16px',
                    flex: 1,
                    overflowY: 'auto',
                  }}
                >
                  {content ? (
                    <div 
                      dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }}
                      style={{
                        color: '#FFFFFF',
                        fontSize: '14px',
                        lineHeight: '1.6',
                      }}
                    />
                  ) : (
                    <Text c="dimmed" size="sm">
                      Введите текст в редакторе для предпросмотра...
                    </Text>
                  )}
                </Box>
              </Tabs.Panel>
            </Tabs>
          </Box>

          {/* Кнопки */}
          <Group justify="flex-end" mt="md" style={{ flexShrink: 0 }}>
            <Button variant="subtle" onClick={onClose} disabled={sending}>
              Отмена
            </Button>
            <Button
              leftSection={sending ? <Loader size={16} /> : <IconSend size={16} />}
              onClick={handleSend}
              color="violet"
              disabled={sending}
            >
              {sending ? 'Отправка...' : 'Отправить'}
            </Button>
          </Group>
        </Box>
      </Group>
    </Modal>
  );
}
