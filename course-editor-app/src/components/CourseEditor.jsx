import { useState, useEffect } from 'react';
import {
  Box,
  ScrollArea,
  TextInput,
  Textarea,
  Select,
  Tabs,
  Stack,
  Paper,
  NumberInput,
  Button,
  Group,
  Text,
  Switch,
  Title,
  UnstyledButton,
} from '@mantine/core';
import { IconBook, IconPlus } from '@tabler/icons-react';
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
import { ChapterEditor } from './ChapterEditor';
import { Preview } from './Preview';
import { ImagePreviewInput } from './ImagePreviewInput';

export function CourseEditor({ course, onCourseChange, previewOpened, onPreviewClose }) {
  const [courseData, setCourseData] = useState(course);
  const [activeTab, setActiveTab] = useState('ru');

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Обновляем courseData когда меняется prop course
  useEffect(() => {
    setCourseData(course);
  }, [course]);

  // Уведомляем родителя об изменениях
  useEffect(() => {
    if (courseData !== course) {
      onCourseChange(courseData);
    }
  }, [courseData]);

  const handleBasicChange = (field, value) => {
    setCourseData({ ...courseData, [field]: value });
  };

  const handleTranslationChange = (lang, field, value) => {
    setCourseData({
      ...courseData,
      translations: {
        ...courseData.translations,
        [lang]: {
          ...courseData.translations[lang],
          [field]: value,
        },
      },
    });
  };

  const handleChapterChange = (lang, chapterIndex, newChapter) => {
    const newChapters = [...courseData.translations[lang].chapters];
    newChapters[chapterIndex] = newChapter;
    handleTranslationChange(lang, 'chapters', newChapters);
  };

  const handleAddChapter = (lang) => {
    const newChapters = [
      ...(courseData.translations[lang].chapters || []),
      { title: 'New Chapter', pages: [] },
    ];
    handleTranslationChange(lang, 'chapters', newChapters);
  };

  const handleRemoveChapter = (lang, chapterIndex) => {
    const newChapters = courseData.translations[lang].chapters.filter(
      (_, i) => i !== chapterIndex
    );
    handleTranslationChange(lang, 'chapters', newChapters);
  };

  const handleDragEnd = (lang, event) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      const chapters = courseData.translations[lang].chapters;
      const oldIndex = chapters.findIndex((_, i) => `chapter-${i}` === active.id);
      const newIndex = chapters.findIndex((_, i) => `chapter-${i}` === over.id);

      const newChapters = arrayMove(chapters, oldIndex, newIndex);
      handleTranslationChange(lang, 'chapters', newChapters);
    }
  };


  const renderTranslationTab = (lang) => {
    const translation = courseData.translations[lang];

    return (
      <Stack gap="xl">
        <TextInput
          label="Course Title"
          value={translation.title || ''}
          onChange={(e) => handleTranslationChange(lang, 'title', e.target.value)}
          placeholder="Enter course title"
        />
        <Textarea
          label="Description"
          value={translation.description || ''}
          onChange={(e) => handleTranslationChange(lang, 'description', e.target.value)}
          placeholder="Enter course description"
          autosize
          minRows={3}
        />

        <Box
          style={{
            borderTop: '1px solid #27272A',
            paddingTop: '24px',
          }}
        >
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={(event) => handleDragEnd(lang, event)}
          >
            <SortableContext
              items={(translation.chapters || []).map((_, i) => `chapter-${i}`)}
              strategy={verticalListSortingStrategy}
            >
              <Stack gap="lg">
                {(translation.chapters || []).map((chapter, chapterIndex) => (
                  <ChapterEditor
                    key={`chapter-${chapterIndex}`}
                    id={`chapter-${chapterIndex}`}
                    chapter={chapter}
                    chapterIndex={chapterIndex}
                    onChange={(newChapter) => handleChapterChange(lang, chapterIndex, newChapter)}
                    onRemove={() => handleRemoveChapter(lang, chapterIndex)}
                  />
                ))}
            
              </Stack>
            </SortableContext>
          </DndContext>

          <UnstyledButton
            onClick={() => handleAddChapter(lang)}
            style={{
              width: '100%',
              padding: '48px',
              border: '2px dashed #27272A',
              borderRadius: '12px',
              backgroundColor: 'transparent',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '12px',
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
            <Box
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                border: '2px solid #27272A',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <IconPlus size={24} color="#71717A" />
            </Box>
            <Text c="#71717A" size="sm">
              {translation.chapters?.length === 0 
                ? 'Click to add your first chapter'
                : 'Click to add a new chapter'}
            </Text>
          </UnstyledButton>
        </Box>
      </Stack>
    );
  };

  return (
    <Box style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <ScrollArea flex={1}>
        <Box p="xl" style={{ maxWidth: 1200, margin: '0 auto' }}>
          {/* General Information */}
          <Paper p="xl" mb="xl">
            <Group justify="space-between" mb="xl">
              <Title order={4} c="#FFFFFF" fw={600} tt="uppercase" style={{ letterSpacing: '0.5px', fontSize: '14px' }}>
                General Information
              </Title>
            </Group>
            
            <Group grow mb="lg" align="flex-start">
              <TextInput
                label="Slug"
                value={courseData.slug}
                disabled
                styles={{
                  input: {
                    cursor: 'not-allowed',
                    opacity: 0.6,
                  },
                }}
              />
              <Select
                label="Level"
                value={courseData.level}
                onChange={(value) => handleBasicChange('level', value)}
                data={[
                  { value: 'beginner', label: 'Beginner' },
                  { value: 'intermediate', label: 'Intermediate' },
                  { value: 'advanced', label: 'Advanced' },
                ]}
              />
              <NumberInput
                label="Price ($)"
                value={courseData.price}
                onChange={(value) => handleBasicChange('price', value)}
                min={0}
              />
            </Group>

            <Group grow mb="lg" align="flex-start">
              <ImagePreviewInput
                label="Cover Image URL"
                value={courseData.coverImageUrl || ''}
                onChange={(e) => handleBasicChange('coverImageUrl', e.target.value)}
                placeholder="https://..."
              />
              <Box>
                <Text
                  size="xs"
                  fw={700}
                  tt="uppercase"
                  c="#A1A1AA"
                  mb="sm"
                  style={{ letterSpacing: '0.5px' }}
                >
                  Published
                </Text>
                <Switch
                  checked={courseData.isPublished}
                  onChange={(e) => handleBasicChange('isPublished', e.currentTarget.checked)}
                  label={courseData.isPublished ? 'Yes' : 'No'}
                  styles={{
                    label: {
                      color: '#FFFFFF',
                      fontSize: '14px',
                      fontWeight: 500,
                    },
                  }}
                />
              </Box>
            </Group>
          </Paper>

          {/* Curriculum */}
          <Paper p="xl">
            <Group mb="xl" align="center">
              <IconBook size={20} color="#10B981" />
              <Title order={4} c="#FFFFFF" fw={600} tt="uppercase" style={{ letterSpacing: '0.5px', fontSize: '14px' }}>
                Curriculum
              </Title>
            </Group>

            <Tabs value={activeTab} onChange={setActiveTab} variant="default">
              <Tabs.List mb="xl">
                <Tabs.Tab value="ru">🇷🇺 Russian</Tabs.Tab>
                <Tabs.Tab value="en">🇬🇧 English</Tabs.Tab>
              </Tabs.List>

              <Tabs.Panel value="ru">
                {renderTranslationTab('ru')}
              </Tabs.Panel>

              <Tabs.Panel value="en">
                {renderTranslationTab('en')}
              </Tabs.Panel>
            </Tabs>
          </Paper>
        </Box>
      </ScrollArea>

      {/* Preview Modal */}
      <Preview
        opened={previewOpened}
        onClose={onPreviewClose}
        course={courseData}
        lang={activeTab}
      />
    </Box>
  );
}
