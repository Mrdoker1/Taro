import { Modal, Box, ScrollArea, Stack, Button, Group, Text, Paper } from '@mantine/core';
import { useState } from 'react';
import { marked } from 'marked';

export function Preview({ opened, onClose, course, lang = 'ru' }) {
  const [selectedLang, setSelectedLang] = useState(lang);
  const [selectedPage, setSelectedPage] = useState({ chapterIndex: 0, pageIndex: 0 });

  if (!course || !course.translations) return null;

  const translation = course.translations[selectedLang];
  if (!translation) return null;

  const renderBlock = (block) => {
    switch (block.type) {
      case 'md':
        const html = marked.parse(block.content || '');
        return (
          <Box
            style={{
              color: 'var(--mantine-color-white)',
              lineHeight: 1.8,
            }}
            dangerouslySetInnerHTML={{ __html: html }}
          />
        );

      case 'image':
        return (
          <Box>
            <img
              src={block.url}
              alt={block.caption}
              style={{ maxWidth: '100%', borderRadius: 8 }}
            />
            {block.caption && (
              <Text ta="center" c="dimmed" mt="xs" fs="italic">
                {block.caption}
              </Text>
            )}
          </Box>
        );

      case 'video':
        return (
          <video controls style={{ maxWidth: '100%', borderRadius: 8 }}>
            <source src={block.url} type="video/mp4" />
          </video>
        );

      case 'card':
        return (
          <Paper p="md" withBorder>
            <Text fw={600} c="gold.6">
              Card: {block.cardId || 'Unknown'}
            </Text>
            <Text size="sm" c="dimmed">
              Deck: {block.deckId || 'Unknown'}
            </Text>
          </Paper>
        );

      default:
        return <Text c="dimmed">Unknown block type: {block.type}</Text>;
    }
  };

  const currentPage =
    translation.chapters?.[selectedPage.chapterIndex]?.pages?.[selectedPage.pageIndex];

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      size="90%"
      title={
        <Text size="xl" fw={700} c="gold.6">
          {translation.title}
        </Text>
      }
      styles={{
        body: { height: 'calc(90vh - 60px)' },
      }}
    >
      <Box style={{ display: 'flex', height: '100%' }}>
        {/* Sidebar Navigation */}
        <Box
          style={{
            width: 300,
            borderRight: '1px solid var(--mantine-color-dark-6)',
            paddingRight: 16,
          }}
        >
          <Group mb="md">
            <Button
              variant={selectedLang === 'ru' ? 'filled' : 'light'}
              color="gold"
              onClick={() => setSelectedLang('ru')}
              size="xs"
            >
              🇷🇺 RU
            </Button>
            <Button
              variant={selectedLang === 'en' ? 'filled' : 'light'}
              color="gold"
              onClick={() => setSelectedLang('en')}
              size="xs"
            >
              🇬🇧 EN
            </Button>
          </Group>

          <ScrollArea h="calc(100% - 50px)">
            <Stack gap="md">
              {(translation.chapters || []).map((chapter, chapterIndex) => (
                <Box key={chapterIndex}>
                  <Text fw={600} c="gold.6" mb="xs">
                    {chapter.title}
                  </Text>
                  <Stack gap="xs">
                    {(chapter.pages || []).map((page, pageIndex) => (
                      <Button
                        key={pageIndex}
                        variant={
                          selectedPage.chapterIndex === chapterIndex &&
                          selectedPage.pageIndex === pageIndex
                            ? 'filled'
                            : 'subtle'
                        }
                        color={
                          selectedPage.chapterIndex === chapterIndex &&
                          selectedPage.pageIndex === pageIndex
                            ? 'gold'
                            : 'gray'
                        }
                        size="sm"
                        fullWidth
                        justify="flex-start"
                        onClick={() => setSelectedPage({ chapterIndex, pageIndex })}
                      >
                        {page.title}
                      </Button>
                    ))}
                  </Stack>
                </Box>
              ))}
            </Stack>
          </ScrollArea>
        </Box>

        {/* Content Area */}
        <ScrollArea flex={1} pl="xl">
          {currentPage ? (
            <Box>
              <Text size="xl" fw={700} mb="xl">
                {currentPage.title}
              </Text>
              <Stack gap="xl">
                {(currentPage.blocks || []).map((block, blockIndex) => (
                  <Box key={blockIndex}>{renderBlock(block)}</Box>
                ))}
              </Stack>
            </Box>
          ) : (
            <Text c="dimmed" ta="center" mt="xl">
              Select a page to preview
            </Text>
          )}
        </ScrollArea>
      </Box>
    </Modal>
  );
}
