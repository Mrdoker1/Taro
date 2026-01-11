import { Paper, TextInput, Button, Stack, Group, Collapse, Text } from '@mantine/core';
import { IconPlus, IconTrash, IconChevronDown, IconChevronUp } from '@tabler/icons-react';
import { useState } from 'react';
import { BlockEditor } from './BlockEditor';

export function PageEditor({ page, pageIndex, onChange, onRemove }) {
  const [expanded, setExpanded] = useState(false);

  const handlePageChange = (field, value) => {
    onChange({ ...page, [field]: value });
  };

  const handleBlockChange = (blockIndex, newBlock) => {
    const newBlocks = [...page.blocks];
    newBlocks[blockIndex] = newBlock;
    handlePageChange('blocks', newBlocks);
  };

  const handleAddBlock = () => {
    const newBlocks = [...(page.blocks || []), { type: 'md', content: '' }];
    handlePageChange('blocks', newBlocks);
    setExpanded(true);
  };

  const handleRemoveBlock = (blockIndex) => {
    const newBlocks = page.blocks.filter((_, i) => i !== blockIndex);
    handlePageChange('blocks', newBlocks);
  };

  return (
    <Paper
      p="md"
      withBorder
      style={{
        backgroundColor: 'var(--mantine-color-dark-9)',
      }}
    >
      <Group justify="space-between" mb="sm">
        <Text fw={600} size="sm" c="white">
          Page {pageIndex + 1}: {page.title || 'Untitled'}
        </Text>
        <Group gap="xs">
          <Button
            variant="subtle"
            size="xs"
            leftSection={expanded ? <IconChevronUp size={14} /> : <IconChevronDown size={14} />}
            onClick={() => setExpanded(!expanded)}
          >
            Blocks
          </Button>
          <Button
            variant="subtle"
            color="red"
            size="xs"
            leftSection={<IconTrash size={14} />}
            onClick={onRemove}
          >
            Remove
          </Button>
        </Group>
      </Group>

      <TextInput
        placeholder="Page title"
        value={page.title || ''}
        onChange={(e) => handlePageChange('title', e.target.value)}
        mb="sm"
      />

      <Collapse in={expanded}>
        <Stack gap="sm" mt="md">
          {(page.blocks || []).map((block, blockIndex) => (
            <BlockEditor
              key={blockIndex}
              block={block}
              blockIndex={blockIndex}
              onChange={(newBlock) => handleBlockChange(blockIndex, newBlock)}
              onRemove={() => handleRemoveBlock(blockIndex)}
            />
          ))}
          <Button
            variant="light"
            leftSection={<IconPlus size={16} />}
            onClick={handleAddBlock}
            fullWidth
          >
            Add Block
          </Button>
        </Stack>
      </Collapse>
    </Paper>
  );
}
