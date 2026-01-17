import { useState } from 'react';
import { Paper, Select, Textarea, TextInput, Button, Group, Box, Modal } from '@mantine/core';
import { IconEye, IconTrash } from '@tabler/icons-react';
import { marked } from 'marked';
import { ImagePreviewInput } from './ImagePreviewInput';

export function BlockEditor({ block, blockIndex, onChange, onRemove }) {
  const [previewOpened, setPreviewOpened] = useState(false);

  const handleChange = (field, value) => {
    onChange({ ...block, [field]: value });
  };

  const renderPreviewContent = () => {
    if (block.type !== 'md' || !block.content) {
      return <Box c="dimmed">Нет контента для предпросмотра</Box>;
    }
    
    const html = marked.parse(block.content);
    return (
      <Box
        style={{
          color: 'var(--mantine-color-white)',
          lineHeight: 1.8,
        }}
      >
        <div dangerouslySetInnerHTML={{ __html: html }} />
      </Box>
    );
  };

  return (
    <Paper
      p="md"
      style={{
        backgroundColor: '#18181B',
        border: '1px solid #27272A',
        borderRadius: '8px',
      }}
    >
      <Group justify="space-between" mb="sm">
        <Select
          label="Тип"
          value={block.type}
          onChange={(value) => handleChange('type', value)}
          data={[
            { value: 'md', label: 'Markdown' },
            { value: 'image', label: 'Изображение' },
            { value: 'card', label: 'Карта' },
            { value: 'video', label: 'Видео' },
          ]}
          style={{ flex: 1 }}
        />
        <Group mt="xl">
          {block.type === 'md' && (
            <Button
              variant="light"
              color="gray"
              size="sm"
              leftSection={<IconEye size={16} />}
              onClick={() => setPreviewOpened(true)}
              styles={{
                root: {
                  color: '#A1A1AA',
                  '&:hover': {
                    backgroundColor: '#27272A',
                  },
                },
              }}
            >
              Предпросмотр
            </Button>
          )}
          <Button
            variant="subtle"
            color="red"
            size="sm"
            leftSection={<IconTrash size={16} />}
            onClick={onRemove}
            styles={{
              root: {
                color: '#EF4444',
                '&:hover': {
                  backgroundColor: 'rgba(239, 68, 68, 0.1)',
                },
              },
            }}
          >
            Удалить
          </Button>
        </Group>
      </Group>

      {block.type === 'md' && (
        <Textarea
          label="Markdown контент"
          value={block.content || ''}
          onChange={(e) => handleChange('content', e.target.value)}
          minRows={10}
          autosize
          maxRows={30}
          styles={{
            input: {
              fontFamily: 'Monaco, Menlo, monospace',
              fontSize: '14px',
            },
          }}
        />
      )}

      {block.type === 'image' && (
        <>
          <ImagePreviewInput
            label="URL изображения"
            value={block.url || ''}
            onChange={(e) => handleChange('url', e.target.value)}
            placeholder="https://..."
            mb="sm"
          />
          <TextInput
            label="Подпись"
            value={block.caption || ''}
            onChange={(e) => handleChange('caption', e.target.value)}
          />
        </>
      )}

      {block.type === 'video' && (
        <TextInput
          label="URL видео"
          value={block.url || ''}
          onChange={(e) => handleChange('url', e.target.value)}
        />
      )}

      {block.type === 'card' && (
        <>
          <TextInput
            label="ID карты"
            value={block.cardId || ''}
            onChange={(e) => handleChange('cardId', e.target.value)}
            mb="sm"
          />
          <TextInput
            label="ID колоды"
            value={block.deckId || ''}
            onChange={(e) => handleChange('deckId', e.target.value)}
          />
        </>
      )}

      {/* Preview Modal */}
      <Modal
        opened={previewOpened}
        onClose={() => setPreviewOpened(false)}
        title="Предпросмотр Markdown"
        size="lg"
      >
        {renderPreviewContent()}
      </Modal>
    </Paper>
  );
}
