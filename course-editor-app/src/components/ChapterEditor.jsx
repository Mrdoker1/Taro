import { Paper, TextInput, Button, Stack, Group, Collapse, Text } from '@mantine/core';
import { IconPlus, IconTrash, IconChevronDown, IconChevronUp } from '@tabler/icons-react';
import { useState } from 'react';
import { PageEditor } from './PageEditor';

export function ChapterEditor({ chapter, chapterIndex, onChange, onRemove }) {
  const [expanded, setExpanded] = useState(false);

  const handleChapterChange = (field, value) => {
    onChange({ ...chapter, [field]: value });
  };

  const handlePageChange = (pageIndex, newPage) => {
    const newPages = [...chapter.pages];
    newPages[pageIndex] = newPage;
    handleChapterChange('pages', newPages);
  };

  const handleAddPage = () => {
    const newPages = [...(chapter.pages || []), { title: 'New Page', blocks: [] }];
    handleChapterChange('pages', newPages);
    setExpanded(true);
  };

  const handleRemovePage = (pageIndex) => {
    const newPages = chapter.pages.filter((_, i) => i !== pageIndex);
    handleChapterChange('pages', newPages);
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
        <Text fw={700} c="gold.6" size="lg">
          Chapter {chapterIndex + 1}: {chapter.title || 'Untitled'}
        </Text>
        <Group gap="xs">
          <Button
            variant="subtle"
            color="gold"
            size="sm"
            leftSection={expanded ? <IconChevronUp size={16} /> : <IconChevronDown size={16} />}
            onClick={() => setExpanded(!expanded)}
          >
            Pages
          </Button>
          <Button
            variant="subtle"
            color="red"
            size="sm"
            leftSection={<IconTrash size={16} />}
            onClick={onRemove}
          >
            Remove
          </Button>
        </Group>
      </Group>

      <TextInput
        label="Chapter Title"
        value={chapter.title || ''}
        onChange={(e) => handleChapterChange('title', e.target.value)}
        mb="sm"
      />

      <Collapse in={expanded}>
        <Stack gap="sm" mt="md">
          {(chapter.pages || []).map((page, pageIndex) => (
            <PageEditor
              key={pageIndex}
              page={page}
              pageIndex={pageIndex}
              onChange={(newPage) => handlePageChange(pageIndex, newPage)}
              onRemove={() => handleRemovePage(pageIndex)}
            />
          ))}
          <Button
            variant="light"
            color="gold"
            leftSection={<IconPlus size={16} />}
            onClick={handleAddPage}
            fullWidth
          >
            Add Page
          </Button>
        </Stack>
      </Collapse>
    </Paper>
  );
}
