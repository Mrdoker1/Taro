import { Paper, TextInput, Button, Stack, Group, Collapse, Text, Box, UnstyledButton } from '@mantine/core';
import { IconPlus, IconTrash, IconChevronDown, IconChevronUp, IconGripVertical } from '@tabler/icons-react';
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
          <Text fw={600} c="#10B981" size="md">
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
              Pages ({(chapter.pages || []).length})
            </Button>
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
              Remove
            </Button>
          </Group>
        </Group>
      </Group>

      <TextInput
        label="Chapter Title"
        value={chapter.title || ''}
        onChange={(e) => handleChapterChange('title', e.target.value)}
        mb="lg"
        placeholder="Enter chapter title"
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
              e.currentTarget.style.borderColor = '#10B981';
              e.currentTarget.style.backgroundColor = 'rgba(16, 185, 129, 0.05)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#27272A';
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <IconPlus size={16} color="#71717A" />
            <Text c="#71717A" size="sm">
              Add New Page
            </Text>
          </UnstyledButton>
        </Box>
      </Collapse>
    </Paper>
  );
}
