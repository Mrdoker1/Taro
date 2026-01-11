import { Stack, Button, Text, Box, ScrollArea } from '@mantine/core';
import { IconPlus } from '@tabler/icons-react';

export function CourseList({ courses, selectedCourse, onSelectCourse, onCreateCourse }) {
  return (
    <Box
      style={{
        width: 300,
        backgroundColor: 'var(--mantine-color-dark-8)',
        borderRight: '1px solid var(--mantine-color-dark-6)',
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
      }}
    >
      <ScrollArea flex={1} p="sm">
        <Stack gap="xs">
          {courses.map((slug) => (
            <Button
              key={slug}
              variant={selectedCourse === slug ? 'filled' : 'subtle'}
              color={selectedCourse === slug ? 'gold' : 'gray'}
              onClick={() => onSelectCourse(slug)}
              fullWidth
              justify="flex-start"
              styles={{
                root: {
                  height: 'auto',
                  padding: '12px 16px',
                },
                label: {
                  whiteSpace: 'normal',
                  textAlign: 'left',
                },
              }}
            >
              {slug}
            </Button>
          ))}
          {courses.length === 0 && (
            <Text c="dimmed" size="sm" ta="center" mt="xl">
              No courses yet
            </Text>
          )}
        </Stack>
      </ScrollArea>

      <Box p="md" style={{ borderTop: '1px solid var(--mantine-color-dark-6)' }}>
        <Button
          fullWidth
          leftSection={<IconPlus size={18} />}
          onClick={onCreateCourse}
          color="gold"
        >
          New Course
        </Button>
      </Box>
    </Box>
  );
}
