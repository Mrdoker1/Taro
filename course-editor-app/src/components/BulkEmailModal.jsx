import { useState } from 'react';
import { Modal, Button, TextInput, Textarea, Stack, Text, Checkbox, Group, ScrollArea, Loader, Box, Tabs } from '@mantine/core';
import { IconMail, IconSend, IconEye, IconCode } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import { usersApi } from '../api/client';
import { marked } from 'marked';

// Рендер markdown для предпросмотра с помощью marked
const renderMarkdown = (markdown) => {
  // Настройка marked
  marked.setOptions({
    breaks: true, // Переносы строк как <br>
    gfm: true, // GitHub Flavored Markdown
  });

  return marked.parse(markdown);
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
        content: {
          minWidth: '400px',
          maxWidth: '1000px',
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
                    overflowX: 'auto',
                    maxWidth: '100%',
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
