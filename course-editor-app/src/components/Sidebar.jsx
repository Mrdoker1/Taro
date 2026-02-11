import { Stack, Button, Text, Box, ScrollArea, UnstyledButton, Select, Group } from '@mantine/core';
import { IconPlus, IconBook, IconCards, IconSparkles, IconUsers, IconMail } from '@tabler/icons-react';

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
  // Users
  users,
  selectedUser,
  onSelectUser,
  onCreateUser,
  usersAppFilter,
  onUsersAppFilterChange,
  onOpenBulkEmail,
}) {
  const sections = [
    { value: 'courses', label: 'Курсы', icon: IconBook },
    { value: 'decks', label: 'Колоды', icon: IconCards },
    { value: 'spreads', label: 'Расклады', icon: IconCards },
    { value: 'prompts', label: 'Промпт-шаблоны', icon: IconSparkles },
    { value: 'users', label: 'Пользователи', icon: IconUsers },
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
        overflow: 'hidden',
      }}
    >
      <Box p="lg" style={{ flexShrink: 0 }}>
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
                borderColor: '#8B5CF6',
              },
            },
          }}
        />
      </Box>

      {/* Decks List */}
      {activeSection === 'decks' && (
        <Box style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
          <Box px="lg" pb="md" style={{ flexShrink: 0 }}>
            <Group justify="space-between" mb="xs">
              <Text size="xs" fw={700} tt="uppercase" c="#71717A" style={{ letterSpacing: '0.5px' }}>
                Колоды
              </Text>
              <Text size="xs" c="#71717A">
                ({decks?.length || 0})
              </Text>
            </Group>
          </Box>

          <Box style={{ flex: 1, minHeight: 0 }}>
            <ScrollArea h="100%" px="md">
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
                      backgroundColor: isSelected ? '#8B5CF6' : 'transparent',
                      color: isSelected ? '#FFFFFF' : '#A1A1AA',
                      fontSize: '13px',
                      fontWeight: 500,
                      textAlign: 'left',
                      transition: 'all 0.2s ease',
                      cursor: 'pointer',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = isSelected ? '#7c3aed' : '#27272A';
                      e.currentTarget.style.color = '#FFFFFF';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = isSelected ? '#8B5CF6' : 'transparent';
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
          </Box>

          <Box p="md" style={{ borderTop: '1px solid #27272A', flexShrink: 0 }}>
            <Button
              fullWidth
              leftSection={<IconPlus size={16} />}
              onClick={onCreateDeck}
              variant="light"
              color="violet"
              styles={{ root: { fontSize: '13px', fontWeight: 600 } }}
            >
              Новая колода
            </Button>
          </Box>
        </Box>
      )}

      {/* Courses List */}
      {activeSection === 'courses' && (
        <Box style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
          <Box px="lg" pb="md" style={{ flexShrink: 0 }}>
            <Group justify="space-between" mb="xs">
              <Text size="xs" fw={700} tt="uppercase" c="#71717A" style={{ letterSpacing: '0.5px' }}>
                Курсы
              </Text>
              <Text size="xs" c="#71717A">
                ({courses?.length || 0})
              </Text>
            </Group>
          </Box>

          <Box style={{ flex: 1, minHeight: 0 }}>
            <ScrollArea h="100%" px="md">
            <Stack gap="xs">
              {courses.map((course) => {
                const courseSlug = course.slug || course;
                const courseTitle = course.title || courseSlug;
                const isValid = course.isValid !== false; // По умолчанию true для обратной совместимости
                const isSelected = selectedCourse === courseSlug;
                return (
                  <UnstyledButton
                    key={courseSlug}
                    onClick={() => onSelectCourse(courseSlug)}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '8px',
                      backgroundColor: isSelected ? '#8B5CF6' : 'transparent',
                      color: isSelected ? '#FFFFFF' : '#A1A1AA',
                      fontSize: '13px',
                      fontWeight: 500,
                      textAlign: 'left',
                      transition: 'all 0.2s ease',
                      cursor: 'pointer',
                      border: !isValid ? '1px solid #EF4444' : 'none',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = isSelected ? '#7c3aed' : '#27272A';
                      e.currentTarget.style.color = '#FFFFFF';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = isSelected ? '#8B5CF6' : 'transparent';
                      e.currentTarget.style.color = isSelected ? '#FFFFFF' : '#A1A1AA';
                    }}
                  >
                    {!isValid && '⚠️ '}
                    {courseTitle}
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
          </Box>

          <Box p="md" style={{ borderTop: '1px solid #27272A', flexShrink: 0 }}>
            <Button
              fullWidth
              leftSection={<IconPlus size={16} />}
              onClick={onCreateCourse}
              variant="light"
              color="violet"
              styles={{ root: { fontSize: '13px', fontWeight: 600 } }}
            >
              Новый курс
            </Button>
          </Box>
        </Box>
      )}

      {/* Spreads List */}
      {activeSection === 'spreads' && (
        <Box style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
          <Box px="lg" pb="md" style={{ flexShrink: 0 }}>
            <Group justify="space-between" mb="xs">
              <Text size="xs" fw={700} tt="uppercase" c="#71717A" style={{ letterSpacing: '0.5px' }}>
                Расклады
              </Text>
              <Text size="xs" c="#71717A">
                ({spreads?.length || 0})
              </Text>
            </Group>
          </Box>

          <Box style={{ flex: 1, minHeight: 0 }}>
            <ScrollArea h="100%" px="md">
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
                      backgroundColor: isSelected ? '#8B5CF6' : 'transparent',
                      color: isSelected ? '#FFFFFF' : '#A1A1AA',
                      fontSize: '13px',
                      fontWeight: 500,
                      textAlign: 'left',
                      transition: 'all 0.2s ease',
                      cursor: 'pointer',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = isSelected ? '#7c3aed' : '#27272A';
                      e.currentTarget.style.color = '#FFFFFF';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = isSelected ? '#8B5CF6' : 'transparent';
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
          </Box>

          <Box p="md" style={{ borderTop: '1px solid #27272A', flexShrink: 0 }}>
            <Button
              fullWidth
              leftSection={<IconPlus size={16} />}
              onClick={onCreateSpread}
              variant="light"
              color="violet"
              styles={{ root: { fontSize: '13px', fontWeight: 600 } }}
            >
              Новый расклад
            </Button>
          </Box>
        </Box>
      )}

      {/* Prompts List */}
      {activeSection === 'prompts' && (
        <Box style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
          <Box px="lg" pb="md" style={{ flexShrink: 0 }}>
            <Group justify="space-between" mb="xs">
              <Text size="xs" fw={700} tt="uppercase" c="#71717A" style={{ letterSpacing: '0.5px' }}>
                Промпт-шаблоны
              </Text>
              <Text size="xs" c="#71717A">
                ({prompts?.length || 0})
              </Text>
            </Group>
          </Box>

          <Box style={{ flex: 1, minHeight: 0 }}>
            <ScrollArea h="100%" px="md">
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
                      backgroundColor: isSelected ? '#8B5CF6' : 'transparent',
                      color: isSelected ? '#FFFFFF' : '#A1A1AA',
                      fontSize: '13px',
                      fontWeight: 500,
                      textAlign: 'left',
                      transition: 'all 0.2s ease',
                      cursor: 'pointer',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = isSelected ? '#7c3aed' : '#27272A';
                      e.currentTarget.style.color = '#FFFFFF';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = isSelected ? '#8B5CF6' : 'transparent';
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
          </Box>

          <Box p="md" style={{ borderTop: '1px solid #27272A', flexShrink: 0 }}>
            <Button
              fullWidth
              leftSection={<IconPlus size={16} />}
              onClick={onCreatePrompt}
              variant="light"
              color="violet"
              styles={{ root: { fontSize: '13px', fontWeight: 600 } }}
            >
              Новый шаблон
            </Button>
          </Box>
        </Box>
      )}

      {/* Users Section */}
      {activeSection === 'users' && (
        <Box style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
          <Box px="lg" pb="md" style={{ flexShrink: 0 }}>
            <Group justify="space-between" mb="xs">
              <Text size="xs" fw={700} tt="uppercase" c="#71717A">
                ПОЛЬЗОВАТЕЛИ
              </Text>
              <Text size="xs" c="#71717A">
                ({(users || []).length})
              </Text>
            </Group>
            <Group gap={4}>
              <Button
                size="xs"
                variant={usersAppFilter === 'taro' ? 'filled' : 'subtle'}
                color={usersAppFilter === 'taro' ? 'violet' : 'gray'}
                onClick={() => onUsersAppFilterChange('taro')}
                styles={{
                  root: {
                    fontSize: '11px',
                    height: '28px',
                    padding: '0 12px',
                  },
                }}
              >
                Taro
              </Button>
              <Button
                size="xs"
                variant={usersAppFilter === 'doc-scan' ? 'filled' : 'subtle'}
                color={usersAppFilter === 'doc-scan' ? 'violet' : 'gray'}
                onClick={() => onUsersAppFilterChange('doc-scan')}
                styles={{
                  root: {
                    fontSize: '11px',
                    height: '28px',
                    padding: '0 12px',
                  },
                }}
              >
                Doc Scan
              </Button>
              <Button
                size="xs"
                variant={usersAppFilter === '' ? 'filled' : 'subtle'}
                color={usersAppFilter === '' ? 'violet' : 'gray'}
                onClick={() => onUsersAppFilterChange('')}
                styles={{
                  root: {
                    fontSize: '11px',
                    height: '28px',
                    padding: '0 12px',
                  },
                }}
              >
                Все
              </Button>
            </Group>
          </Box>

          <Box style={{ flex: 1, minHeight: 0 }}>
            <ScrollArea h="100%" px="sm">
            <Stack gap={0}>
              {(users || []).map((user) => {
                const isSelected = selectedUser === user._id;
                return (
                  <UnstyledButton
                    key={user._id}
                    onClick={() => onSelectUser(user._id)}
                    style={{
                      padding: '12px 16px',
                      borderRadius: '8px',
                      backgroundColor: isSelected ? '#8B5CF6' : 'transparent',
                      color: isSelected ? '#FFFFFF' : '#A1A1AA',
                      transition: 'all 0.2s',
                      fontSize: '13px',
                      fontWeight: 500,
                      textAlign: 'left',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = isSelected ? '#7c3aed' : '#27272A';
                      e.currentTarget.style.color = '#FFFFFF';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = isSelected ? '#8B5CF6' : 'transparent';
                      e.currentTarget.style.color = isSelected ? '#FFFFFF' : '#A1A1AA';
                    }}
                  >
                    <Text size="sm" fw={500} truncate>
                      {user.email}
                    </Text>
                    <Text size="xs" c={isSelected ? 'rgba(255, 255, 255, 0.7)' : 'dimmed'}>
                      {user.appType} • {user.role}
                    </Text>
                  </UnstyledButton>
                );
              })}
              {(!users || users.length === 0) && (
                <Text c="#71717A" size="sm" ta="center" mt="xl">
                  Нет пользователей
                </Text>
              )}
            </Stack>
            </ScrollArea>
          </Box>

          <Box p="md" style={{ borderTop: '1px solid #27272A', flexShrink: 0 }}>
            <Stack gap="xs">
              <Button
                fullWidth
                leftSection={<IconMail size={16} />}
                onClick={onOpenBulkEmail}
                variant="light"
                color="blue"
                styles={{ root: { fontSize: '13px', fontWeight: 600 } }}
              >
                Email рассылка
              </Button>
              <Button
                fullWidth
                leftSection={<IconPlus size={16} />}
                onClick={onCreateUser}
                variant="light"
                color="violet"
                styles={{ root: { fontSize: '13px', fontWeight: 600 } }}
              >
                Новый пользователь
              </Button>
            </Stack>
          </Box>
        </Box>
      )}
    </Box>
  );
}
