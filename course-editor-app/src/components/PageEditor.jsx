import { Paper, TextInput, Button, Stack, Group, Collapse, Text, Box, UnstyledButton } from '@mantine/core';
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
      style={{
        backgroundColor: '#111114',
        border: '1px solid #27272A',
        borderRadius: '8px',
      }}
    >
      <Group justify="space-between" mb="sm">
        <Text fw={500} size="sm" c="#FFFFFF">
          Page {pageIndex + 1}: {page.title || 'Untitled'}
        </Text>
        <Group gap="xs">
          <Button
            variant="subtle"
            size="xs"
            leftSection={expanded ? <IconChevronUp size={14} /> : <IconChevronDown size={14} />}
            onClick={() => setExpanded(!expanded)}
            styles={{
              root: {
                color: '#A1A1AA',
                fontSize: '12px',
                '&:hover': {
                  backgroundColor: '#27272A',
                },
              },
            }}
          >
            Blocks
          </Button>
          <Button
            variant="subtle"
            color="red"
            size="xs"
            leftSection={<IconTrash size={14} />}
            onClick={onRemove}
            styles={{
              root: {
                color: '#EF4444',
                fontSize: '12px',
                '&:hover': {
                  backgroundColor: 'rgba(239, 68, 68, 0.1)',
                },
              },
            }}
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
          <UnstyledButton
            onClick={handleAddBlock}
            style={{
              width: '100%',
              padding: '16px',
              border: '2px dashed #27272A',
              borderRadius: '8px',
              backgroundColor: 'transparent',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#10B981';
              e.currentTarget.style.backgroundColor = 'rgba(16, 185, 129, 0.05)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#27272A';
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <IconPlus size={14} color="#71717A" />
            <Text c="#71717A" size="xs">
              Add Block
            </Text>
          </UnstyledButton>
        </Stack>
      </Collapse>
    </Paper>
  );
}
