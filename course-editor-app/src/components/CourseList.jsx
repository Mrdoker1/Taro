import { Stack, Button, Text, Box, ScrollArea, UnstyledButton } from '@mantine/core';
import { IconPlus } from '@tabler/icons-react';

export function CourseList({ courses, selectedCourse, onSelectCourse, onCreateCourse }) {
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
        <Text
          size="xs"
          fw={700}
          tt="uppercase"
          c="#71717A"
          mb="md"
          style={{ letterSpacing: '0.5px' }}
        >
          My Courses
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
          styles={{
            root: {
              fontSize: '13px',
              fontWeight: 600,
            },
          }}
        >
          New Course
        </Button>
      </Box>
    </Box>
  );
}
