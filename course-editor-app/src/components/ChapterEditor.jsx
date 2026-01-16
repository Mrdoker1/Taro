import { Paper, TextInput, Button, Stack, Group, Collapse, Text, Box, UnstyledButton, Menu, ActionIcon } from '@mantine/core';
import { IconPlus, IconTrash, IconChevronDown, IconChevronUp, IconGripVertical, IconDots, IconDownload, IconUpload } from '@tabler/icons-react';
import { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { PageEditor } from './PageEditor';

export function ChapterEditor({ id, chapter, chapterIndex, onChange, onRemove }) {
  const [expanded, setExpanded] = useState(false);
  
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );
  
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

  const handleChapterChange = (field, value) => {
    onChange({ ...chapter, [field]: value });
  };

  const handlePageChange = (pageIndex, newPage) => {
    const newPages = [...chapter.pages];
    newPages[pageIndex] = newPage;
    handleChapterChange('pages', newPages);
  };

  const handleAddPage = () => {
    const newPages = [
      ...(chapter.pages || []), 
      { 
        _id: `page-${Date.now()}-${Math.random()}`,
        title: 'New Page', 
        blocks: [] 
      }
    ];
    handleChapterChange('pages', newPages);
    setExpanded(true);
  };

  const handleRemovePage = (pageIndex) => {
    const newPages = chapter.pages.filter((_, i) => i !== pageIndex);
    handleChapterChange('pages', newPages);
  };

  const handlePageDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      const pages = chapter.pages;
      const oldIndex = pages.findIndex((p) => p._id === active.id);
      const newIndex = pages.findIndex((p) => p._id === over.id);

      const newPages = arrayMove(pages, oldIndex, newIndex);
      handleChapterChange('pages', newPages);
    }
  };

  const handleExportChapter = () => {
    const dataStr = JSON.stringify(chapter, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `chapter-${chapter.title || 'untitled'}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleImportChapter = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            const importedChapter = JSON.parse(event.target.result);
            onChange(importedChapter);
          } catch (error) {
            alert('Ошибка при импорте главы: ' + error.message);
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
      p="lg"
      style={{
        ...style,
        backgroundColor: '#18181B',
        border: '1px solid #27272A',
        borderRadius: '12px',
      }}
    >
      <Group gap="md" mb="md">
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
          <IconGripVertical size={20} />
        </Box>
        <Group justify="space-between" style={{ flex: 1 }}>
          <Text fw={600} c="#8B5CF6" size="md">
            Chapter {chapterIndex + 1}: {chapter.title || 'Untitled'}
          </Text>
          <Group gap="xs">
            <Button
              variant="subtle"
              color="gray"
              size="sm"
              leftSection={expanded ? <IconChevronUp size={16} /> : <IconChevronDown size={16} />}
              onClick={() => setExpanded(!expanded)}
              styles={{
                root: {
                  color: '#A1A1AA',
                  '&:hover': {
                    backgroundColor: '#27272A',
                  },
                },
              }}
            >
              Страницы ({(chapter.pages || []).length})
            </Button>
            
            <Menu shadow="md" width={200}>
              <Menu.Target>
                <ActionIcon
                  variant="subtle"
                  color="gray"
                  size="lg"
                  styles={{
                    root: {
                      color: '#A1A1AA',
                      '&:hover': {
                        backgroundColor: '#27272A',
                      },
                    },
                  }}
                >
                  <IconDots size={18} />
                </ActionIcon>
              </Menu.Target>

              <Menu.Dropdown style={{ backgroundColor: '#18181B', border: '1px solid #27272A' }}>
                <Menu.Item
                  leftSection={<IconDownload size={16} />}
                  onClick={handleExportChapter}
                  styles={{
                    item: {
                      color: '#FFFFFF',
                      '&:hover': {
                        backgroundColor: '#27272A',
                      },
                    },
                  }}
                >
                  Экспорт главы
                </Menu.Item>
                <Menu.Item
                  leftSection={<IconUpload size={16} />}
                  onClick={handleImportChapter}
                  styles={{
                    item: {
                      color: '#FFFFFF',
                      '&:hover': {
                        backgroundColor: '#27272A',
                      },
                    },
                  }}
                >
                  Импорт главы
                </Menu.Item>
                <Menu.Divider style={{ borderColor: '#27272A' }} />
                <Menu.Item
                  leftSection={<IconTrash size={16} />}
                  onClick={onRemove}
                  color="red"
                  styles={{
                    item: {
                      color: '#EF4444',
                      '&:hover': {
                        backgroundColor: 'rgba(239, 68, 68, 0.1)',
                      },
                    },
                  }}
                >
                  Удалить главу
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </Group>
        </Group>
      </Group>

      <TextInput
        label="Название главы"
        value={chapter.title || ''}
        onChange={(e) => handleChapterChange('title', e.target.value)}
        mb="lg"
        placeholder="Введите название главы"
      />

      <Collapse in={expanded}>
        <Box
          style={{
            borderLeft: '2px solid #27272A',
            paddingLeft: '24px',
            marginTop: '16px',
          }}
        >
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handlePageDragEnd}
          >
            <SortableContext
              items={(chapter.pages || []).map((p) => p._id || `temp-${Math.random()}`)}
              strategy={verticalListSortingStrategy}
            >
              <Stack gap="md">
                {(chapter.pages || []).map((page, pageIndex) => {
                  // Генерируем уникальный ID если его нет
                  if (!page._id) {
                    page._id = `page-${Date.now()}-${pageIndex}`;
                  }
                  return (
                    <PageEditor
                      key={page._id}
                      id={page._id}
                      page={page}
                      pageIndex={pageIndex}
                      onChange={(newPage) => handlePageChange(pageIndex, newPage)}
                      onRemove={() => handleRemovePage(pageIndex)}
                    />
                  );
                })}
              </Stack>
            </SortableContext>
          </DndContext>
          
          <UnstyledButton
            onClick={handleAddPage}
            style={{
              width: '100%',
              padding: '24px',
              border: '2px dashed #27272A',
              borderRadius: '8px',
              backgroundColor: 'transparent',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              marginTop: '16px',
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
            <IconPlus size={16} color="#71717A" />
            <Text c="#71717A" size="sm">
              Добавить страницу
            </Text>
          </UnstyledButton>
        </Box>
      </Collapse>
    </Paper>
  );
}
