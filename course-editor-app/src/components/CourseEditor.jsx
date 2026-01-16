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
import { IconBook, IconPlus, IconDownload } from '@tabler/icons-react';
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
      { 
        _id: `chapter-${Date.now()}-${Math.random()}`,
        title: 'New Chapter', 
        pages: [] 
      },
    ];
    handleTranslationChange(lang, 'chapters', newChapters);
  };

  const handleRemoveChapter = (lang, chapterIndex) => {
    const newChapters = courseData.translations[lang].chapters.filter(
      (_, i) => i !== chapterIndex
    );
    handleTranslationChange(lang, 'chapters', newChapters);
  };

  const handleDownloadJSON = () => {
    const dataStr = JSON.stringify(courseData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `course-${courseData.key || 'backup'}-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleDragEnd = (lang, event) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      const chapters = courseData.translations[lang].chapters;
      const oldIndex = chapters.findIndex((ch) => ch._id === active.id);
      const newIndex = chapters.findIndex((ch) => ch._id === over.id);

      const newChapters = arrayMove(chapters, oldIndex, newIndex);
      
      // Обновляем состояние напрямую, чтобы избежать задержек
      setCourseData({
        ...courseData,
        translations: {
          ...courseData.translations,
          [lang]: {
            ...courseData.translations[lang],
            chapters: newChapters,
          },
        },
      });
    }
  };


  const renderTranslationTab = (lang) => {
    const translation = courseData.translations[lang];

    return (
      <Stack gap="xl">
        <TextInput
          label="Название курса"
          value={translation.title || ''}
          onChange={(e) => handleTranslationChange(lang, 'title', e.target.value)}
          placeholder="Введите название курса"
        />
        <Textarea
          label="Описание"
          value={translation.description || ''}
          onChange={(e) => handleTranslationChange(lang, 'description', e.target.value)}
          placeholder="Введите описание курса"
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
              items={(translation.chapters || []).map((ch) => ch._id || `temp-${Math.random()}`)}
              strategy={verticalListSortingStrategy}
            >
              <Stack gap="lg">
                {(translation.chapters || []).map((chapter, chapterIndex) => {
                  // Генерируем уникальный ID если его нет
                  if (!chapter._id) {
                    chapter._id = `chapter-${Date.now()}-${chapterIndex}`;
                  }
                  return (
                    <ChapterEditor
                      key={chapter._id}
                      id={chapter._id}
                      chapter={chapter}
                      chapterIndex={chapterIndex}
                      onChange={(newChapter) => handleChapterChange(lang, chapterIndex, newChapter)}
                      onRemove={() => handleRemoveChapter(lang, chapterIndex)}
                    />
                  );
                })}
            
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
              e.currentTarget.style.borderColor = '#8B5CF6';
              e.currentTarget.style.backgroundColor = 'rgba(139, 92, 246, 0.05)';
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
                ? 'Нажмите, чтобы добавить первую главу'
                : 'Нажмите, чтобы добавить новую главу'}
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
                Общая информация
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
                label="Уровень"
                value={courseData.level}
                onChange={(value) => handleBasicChange('level', value)}
                data={[
                  { value: 'beginner', label: 'Начинающий' },
                  { value: 'intermediate', label: 'Средний' },
                  { value: 'advanced', label: 'Продвинутый' },
                ]}
              />
              <NumberInput
                label="Цена ($)"
                value={courseData.price}
                onChange={(value) => handleBasicChange('price', value)}
                min={0}
              />
            </Group>

            <Group grow mb="lg" align="flex-start">
              <ImagePreviewInput
                label="URL обложки"
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
                  Опубликован
                </Text>
                <Switch
                  checked={courseData.isPublished}
                  onChange={(e) => handleBasicChange('isPublished', e.currentTarget.checked)}
                  label={courseData.isPublished ? 'Да' : 'Нет'}
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
              <IconBook size={20} color="#8B5CF6" />
              <Title order={4} c="#FFFFFF" fw={600} tt="uppercase" style={{ letterSpacing: '0.5px', fontSize: '14px' }}>
                Учебная программа
              </Title>
            </Group>

            <Tabs value={activeTab} onChange={setActiveTab} variant="default">
              <Tabs.List mb="xl">
                <Tabs.Tab value="ru">Русский</Tabs.Tab>
                <Tabs.Tab value="en">English</Tabs.Tab>
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
