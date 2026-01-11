import { Stack, Button, Text, Box, ScrollArea, UnstyledButton, Select } from '@mantine/core';
import { IconPlus, IconBook, IconCards, IconSparkles } from '@tabler/icons-react';

export function Sidebar({ 
  activeSection, 
  onSectionChange,
  // Courses
  courses, 
  selectedCourse, 
  onSelectCourse, 
  onCreateCourse,
  // Decks
  decks,
  selectedDeck,
  onSelectDeck,
  onCreateDeck,
  // Spreads
  spreads,
  selectedSpread,
  onSelectSpread,
  onCreateSpread,
  // Prompts
  prompts,
  selectedPrompt,
  onSelectPrompt,
  onCreatePrompt,
}) {
  const sections = [
    { value: 'courses', label: 'Курсы', icon: IconBook },
    { value: 'decks', label: 'Колоды', icon: IconCards },
    { value: 'spreads', label: 'Расклады', icon: IconCards },
    { value: 'prompts', label: 'Промпт-шаблоны', icon: IconSparkles },
  ];

  return (
    <Box
      style={{
        width: 240,
        backgroundColor: '#18181B',
        borderRight: '1px solid #27272A',
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
      }}
    >
      <Box p="lg">
        <Select
          value={activeSection}
          onChange={onSectionChange}
          data={sections.map(s => ({ value: s.value, label: s.label }))}
          styles={{
            input: {
              backgroundColor: '#27272A',
              borderColor: '#3F3F46',
              color: '#FFFFFF',
              fontWeight: 600,
              '&:focus': {
                borderColor: '#10B981',
              },
            },
          }}
        />
      </Box>

      {/* Decks List */}
      {activeSection === 'decks' && (
        <>
          <Box px="lg" pb="md">
            <Text size="xs" fw={700} tt="uppercase" c="#71717A" style={{ letterSpacing: '0.5px' }}>
              Колоды
            </Text>
          </Box>

          <ScrollArea flex={1} px="md">
            <Stack gap="xs">
              {decks?.map((deck) => {
                const isSelected = selectedDeck === (deck.key || deck.id);
                return (
                  <UnstyledButton
                    key={deck.key || deck.id}
                    onClick={() => onSelectDeck(deck.key || deck.id)}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '8px',
                      backgroundColor: isSelected ? '#10B981' : 'transparent',
                      color: isSelected ? '#FFFFFF' : '#A1A1AA',
                      fontSize: '13px',
                      fontWeight: 500,
                      textAlign: 'left',
                      transition: 'all 0.2s ease',
                      cursor: 'pointer',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = isSelected ? '#059669' : '#27272A';
                      e.currentTarget.style.color = '#FFFFFF';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = isSelected ? '#10B981' : 'transparent';
                      e.currentTarget.style.color = isSelected ? '#FFFFFF' : '#A1A1AA';
                    }}
                  >
                    {deck.name || deck.key || deck.id}
                  </UnstyledButton>
                );
              })}
              {(!decks || decks.length === 0) && (
                <Text c="#71717A" size="sm" ta="center" mt="xl">
                  Нет колод
                </Text>
              )}
            </Stack>
          </ScrollArea>

          <Box p="md" style={{ borderTop: '1px solid #27272A' }}>
            <Button
              fullWidth
              leftSection={<IconPlus size={16} />}
              onClick={onCreateDeck}
              variant="light"
              color="emerald"
              styles={{ root: { fontSize: '13px', fontWeight: 600 } }}
            >
              Новая колода
            </Button>
          </Box>
        </>
      )}

      {/* Courses List */}
      {activeSection === 'courses' && (
        <>
          <Box px="lg" pb="md">
            <Text size="xs" fw={700} tt="uppercase" c="#71717A" style={{ letterSpacing: '0.5px' }}>
              Курсы
            </Text>
          </Box>

          <ScrollArea flex={1} px="md">
            <Stack gap="xs">
              {courses.map((slug) => {
                const isSelected = selectedCourse === slug;
                return (
                  <UnstyledButton
                    key={slug}
                    onClick={() => onSelectCourse(slug)}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '8px',
                      backgroundColor: isSelected ? '#10B981' : 'transparent',
                      color: isSelected ? '#FFFFFF' : '#A1A1AA',
                      fontSize: '13px',
                      fontWeight: 500,
                      textAlign: 'left',
                      transition: 'all 0.2s ease',
                      cursor: 'pointer',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = isSelected ? '#059669' : '#27272A';
                      e.currentTarget.style.color = '#FFFFFF';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = isSelected ? '#10B981' : 'transparent';
                      e.currentTarget.style.color = isSelected ? '#FFFFFF' : '#A1A1AA';
                    }}
                  >
                    {slug}
                  </UnstyledButton>
                );
              })}
              {courses.length === 0 && (
                <Text c="#71717A" size="sm" ta="center" mt="xl">
                  No courses yet
                </Text>
              )}
            </Stack>
          </ScrollArea>

          <Box p="md" style={{ borderTop: '1px solid #27272A' }}>
            <Button
              fullWidth
              leftSection={<IconPlus size={16} />}
              onClick={onCreateCourse}
              variant="light"
              color="emerald"
              styles={{ root: { fontSize: '13px', fontWeight: 600 } }}
            >
              New Course
            </Button>
          </Box>
        </>
      )}

      {/* Spreads List */}
      {activeSection === 'spreads' && (
        <>
          <Box px="lg" pb="md">
            <Text size="xs" fw={700} tt="uppercase" c="#71717A" style={{ letterSpacing: '0.5px' }}>
              Расклады
            </Text>
          </Box>

          <ScrollArea flex={1} px="md">
            <Stack gap="xs">
              {spreads?.map((spread) => {
                const isSelected = selectedSpread === (spread.id || spread.key);
                return (
                  <UnstyledButton
                    key={spread.id || spread.key}
                    onClick={() => onSelectSpread(spread.id || spread.key)}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '8px',
                      backgroundColor: isSelected ? '#10B981' : 'transparent',
                      color: isSelected ? '#FFFFFF' : '#A1A1AA',
                      fontSize: '13px',
                      fontWeight: 500,
                      textAlign: 'left',
                      transition: 'all 0.2s ease',
                      cursor: 'pointer',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = isSelected ? '#059669' : '#27272A';
                      e.currentTarget.style.color = '#FFFFFF';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = isSelected ? '#10B981' : 'transparent';
                      e.currentTarget.style.color = isSelected ? '#FFFFFF' : '#A1A1AA';
                    }}
                  >
                    {spread.name || spread.id || spread.key}
                  </UnstyledButton>
                );
              })}
              {(!spreads || spreads.length === 0) && (
                <Text c="#71717A" size="sm" ta="center" mt="xl">
                  Нет раскладов
                </Text>
              )}
            </Stack>
          </ScrollArea>

          <Box p="md" style={{ borderTop: '1px solid #27272A' }}>
            <Button
              fullWidth
              leftSection={<IconPlus size={16} />}
              onClick={onCreateSpread}
              variant="light"
              color="emerald"
              styles={{ root: { fontSize: '13px', fontWeight: 600 } }}
            >
              Новый расклад
            </Button>
          </Box>
        </>
      )}

      {/* Prompts List */}
      {activeSection === 'prompts' && (
        <>
          <Box px="lg" pb="md">
            <Text size="xs" fw={700} tt="uppercase" c="#71717A" style={{ letterSpacing: '0.5px' }}>
              Промпт-шаблоны
            </Text>
          </Box>

          <ScrollArea flex={1} px="md">
            <Stack gap="xs">
              {prompts?.map((prompt) => {
                const isSelected = selectedPrompt === prompt.key;
                return (
                  <UnstyledButton
                    key={prompt.key}
                    onClick={() => onSelectPrompt(prompt.key)}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '8px',
                      backgroundColor: isSelected ? '#10B981' : 'transparent',
                      color: isSelected ? '#FFFFFF' : '#A1A1AA',
                      fontSize: '13px',
                      fontWeight: 500,
                      textAlign: 'left',
                      transition: 'all 0.2s ease',
                      cursor: 'pointer',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = isSelected ? '#059669' : '#27272A';
                      e.currentTarget.style.color = '#FFFFFF';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = isSelected ? '#10B981' : 'transparent';
                      e.currentTarget.style.color = isSelected ? '#FFFFFF' : '#A1A1AA';
                    }}
                  >
                    {prompt.key}
                  </UnstyledButton>
                );
              })}
              {(!prompts || prompts.length === 0) && (
                <Text c="#71717A" size="sm" ta="center" mt="xl">
                  Нет шаблонов
                </Text>
              )}
            </Stack>
          </ScrollArea>

          <Box p="md" style={{ borderTop: '1px solid #27272A' }}>
            <Button
              fullWidth
              leftSection={<IconPlus size={16} />}
              onClick={onCreatePrompt}
              variant="light"
              color="emerald"
              styles={{ root: { fontSize: '13px', fontWeight: 600 } }}
            >
              Новый шаблон
            </Button>
          </Box>
        </>
      )}
    </Box>
  );
}
