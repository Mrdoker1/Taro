import { useState } from 'react';
import { Paper, Select, Textarea, TextInput, Button, Group, Box, Modal } from '@mantine/core';
import { IconEye, IconTrash } from '@tabler/icons-react';
import { marked } from 'marked';

export function BlockEditor({ block, blockIndex, onChange, onRemove }) {
  const [previewOpened, setPreviewOpened] = useState(false);

  const handleChange = (field, value) => {
    onChange({ ...block, [field]: value });
  };

  const renderPreviewContent = () => {
    if (block.type !== 'md' || !block.content) {
      return <Box c="dimmed">No content to preview</Box>;
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
      withBorder
      style={{
        backgroundColor: 'var(--mantine-color-dark-8)',
      }}
    >
      <Group justify="space-between" mb="sm">
        <Select
          label="Type"
          value={block.type}
          onChange={(value) => handleChange('type', value)}
          data={[
            { value: 'md', label: 'Markdown' },
            { value: 'image', label: 'Image' },
            { value: 'card', label: 'Card' },
            { value: 'video', label: 'Video' },
          ]}
          style={{ flex: 1 }}
        />
        <Group mt="xl">
          {block.type === 'md' && (
            <Button
              variant="light"
              color="violet"
              size="sm"
              leftSection={<IconEye size={16} />}
              onClick={() => setPreviewOpened(true)}
            >
              Preview
            </Button>
          )}
          <Button
            variant="light"
            color="red"
            size="sm"
            leftSection={<IconTrash size={16} />}
            onClick={onRemove}
          >
            Remove
          </Button>
        </Group>
      </Group>

      {block.type === 'md' && (
        <Textarea
          label="Markdown Content"
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
          <TextInput
            label="Image URL"
            value={block.url || ''}
            onChange={(e) => handleChange('url', e.target.value)}
            mb="sm"
          />
          <TextInput
            label="Caption"
            value={block.caption || ''}
            onChange={(e) => handleChange('caption', e.target.value)}
          />
        </>
      )}

      {block.type === 'video' && (
        <TextInput
          label="Video URL"
          value={block.url || ''}
          onChange={(e) => handleChange('url', e.target.value)}
        />
      )}

      {block.type === 'card' && (
        <>
          <TextInput
            label="Card ID"
            value={block.cardId || ''}
            onChange={(e) => handleChange('cardId', e.target.value)}
            mb="sm"
          />
          <TextInput
            label="Deck ID"
            value={block.deckId || ''}
            onChange={(e) => handleChange('deckId', e.target.value)}
          />
        </>
      )}

      {/* Preview Modal */}
      <Modal
        opened={previewOpened}
        onClose={() => setPreviewOpened(false)}
        title="Markdown Preview"
        size="lg"
      >
        {renderPreviewContent()}
      </Modal>
    </Paper>
  );
}
