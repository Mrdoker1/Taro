import { useState, useEffect } from 'react';
import {
  Box,
  ScrollArea,
  TextInput,
  Select,
  Tabs,
  Stack,
  Paper,
  NumberInput,
  Button,
  Group,
} from '@mantine/core';
import { ChapterEditor } from './ChapterEditor';
import { Preview } from './Preview';

export function CourseEditor({ course, onCourseChange, previewOpened, onPreviewClose }) {
  const [courseData, setCourseData] = useState(course);
  const [activeTab, setActiveTab] = useState('ru');

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


  const renderTranslationTab = (lang) => {
    const translation = courseData.translations[lang];

    return (
      <Stack gap="lg">
        <Stack gap="sm">
          <TextInput
            label="Title"
            value={translation.title || ''}
            onChange={(e) => handleTranslationChange(lang, 'title', e.target.value)}
          />
          <TextInput
            label="Description"
            value={translation.description || ''}
            onChange={(e) => handleTranslationChange(lang, 'description', e.target.value)}
          />
        </Stack>

        <Box
          style={{
            borderTop: '1px solid var(--mantine-color-dark-6)',
            paddingTop: '1rem',
          }}
        >
          <Stack gap="md">
            {(translation.chapters || []).map((chapter, chapterIndex) => (
              <ChapterEditor
                key={chapterIndex}
                chapter={chapter}
                chapterIndex={chapterIndex}
                onChange={(newChapter) => handleChapterChange(lang, chapterIndex, newChapter)}
                onRemove={() => handleRemoveChapter(lang, chapterIndex)}
              />
            ))}
            <Button
              variant="light"
              color="gold"
              onClick={() => handleAddChapter(lang)}
              fullWidth
            >
              Add Chapter
            </Button>
          </Stack>
        </Box>
      </Stack>
    );
  };

  return (
    <Box style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <ScrollArea flex={1}>
        <Box p="md">
          {/* Basic Info */}
          <Paper p="lg" mb="md" withBorder>
            <Group grow mb="md">
              <TextInput label="Slug" value={courseData.slug} disabled />
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
            </Group>
            <Group grow mb="md">
              <NumberInput
                label="Price"
                value={courseData.price}
                onChange={(value) => handleBasicChange('price', value)}
              />
              <Select
                label="Published"
                value={courseData.isPublished ? 'true' : 'false'}
                onChange={(value) => handleBasicChange('isPublished', value === 'true')}
                data={[
                  { value: 'true', label: 'Yes' },
                  { value: 'false', label: 'No' },
                ]}
              />
            </Group>
            <TextInput
              label="Cover Image URL"
              value={courseData.coverImageUrl || ''}
              onChange={(e) => handleBasicChange('coverImageUrl', e.target.value)}
            />
          </Paper>

          {/* Translations */}
          <Paper withBorder>
            <Tabs value={activeTab} onChange={setActiveTab}>
              <Tabs.List>
                <Tabs.Tab value="ru">🇷🇺 Russian</Tabs.Tab>
                <Tabs.Tab value="en">🇬🇧 English</Tabs.Tab>
              </Tabs.List>

              <Box p="lg">
                <Tabs.Panel value="ru">
                  {renderTranslationTab('ru')}
                </Tabs.Panel>

                <Tabs.Panel value="en">
                  {renderTranslationTab('en')}
                </Tabs.Panel>
              </Box>
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
