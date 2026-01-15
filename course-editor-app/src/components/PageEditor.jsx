import { Paper, TextInput, Button, Stack, Group, Collapse, Text, Box, UnstyledButton, Menu, ActionIcon } from '@mantine/core';
import { IconPlus, IconTrash, IconChevronDown, IconChevronUp, IconGripVertical, IconDots, IconDownload, IconUpload } from '@tabler/icons-react';
import { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { BlockEditor } from './BlockEditor';

export function PageEditor({ id, page, pageIndex, onChange, onRemove }) {
  const [expanded, setExpanded] = useState(false);
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

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

  const handleExportPage = () => {
    const dataStr = JSON.stringify(page, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `page-${page.title || 'untitled'}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleImportPage = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            const importedPage = JSON.parse(event.target.result);
            onChange(importedPage);
          } catch (error) {
            alert('Ошибка при импорте страницы: ' + error.message);
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  return (
    <Paper
      ref={setNodeRef}
      p="md"
      style={{
        ...style,
        backgroundColor: '#111114',
        border: '1px solid #27272A',
        borderRadius: '8px',
      }}
    >
      <Group gap="xs" mb="sm">
        <Box
          {...attributes}
          {...listeners}
          style={{
            cursor: isDragging ? 'grabbing' : 'grab',
            color: '#71717A',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <IconGripVertical size={16} />
        </Box>
        <Group justify="space-between" style={{ flex: 1 }}>
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
          
          <Menu shadow="md" width={200}>
            <Menu.Target>
              <ActionIcon
                variant="subtle"
                color="gray"
                size="sm"
                styles={{
                  root: {
                    color: '#A1A1AA',
                    '&:hover': {
                      backgroundColor: '#27272A',
                    },
                  },
                }}
              >
                <IconDots size={14} />
              </ActionIcon>
            </Menu.Target>

            <Menu.Dropdown style={{ backgroundColor: '#18181B', border: '1px solid #27272A' }}>
              <Menu.Item
                leftSection={<IconDownload size={14} />}
                onClick={handleExportPage}
                styles={{
                  item: {
                    color: '#FFFFFF',
                    fontSize: '12px',
                    '&:hover': {
                      backgroundColor: '#27272A',
                    },
                  },
                }}
              >
                Экспорт страницы
              </Menu.Item>
              <Menu.Item
                leftSection={<IconUpload size={14} />}
                onClick={handleImportPage}
                styles={{
                  item: {
                    color: '#FFFFFF',
                    fontSize: '12px',
                    '&:hover': {
                      backgroundColor: '#27272A',
                    },
                  },
                }}
              >
                Импорт страницы
              </Menu.Item>
              <Menu.Divider style={{ borderColor: '#27272A' }} />
              <Menu.Item
                leftSection={<IconTrash size={14} />}
                onClick={onRemove}
                color="red"
                styles={{
                  item: {
                    color: '#EF4444',
                    fontSize: '12px',
                    '&:hover': {
                      backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    },
                  },
                }}
              >
                Удалить страницу
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
          </Group>
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
              e.currentTarget.style.borderColor = '#8B5CF6';
              e.currentTarget.style.backgroundColor = 'rgba(139, 92, 246, 0.05)';
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
