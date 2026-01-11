import { useState, useEffect } from 'react';
import { AppShell, Box, Title, Button, Group, TextInput, Modal, Breadcrumbs, Anchor, Text } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconLogout, IconDeviceFloppy, IconTrash, IconEye, IconChevronRight } from '@tabler/icons-react';
import { Login } from './components/Login';
import { CourseList } from './components/CourseList';
import { CourseEditor } from './components/CourseEditor';
import { courseApi } from './api/client';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [courseData, setCourseData] = useState(null);
  const [createModalOpened, setCreateModalOpened] = useState(false);
  const [newCourseSlug, setNewCourseSlug] = useState('');
  const [loading, setLoading] = useState(false);
  const [previewOpened, setPreviewOpened] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('editor-token');
    if (token) {
      setIsAuthenticated(true);
      loadCourses();
    }
  }, []);

  const loadCourses = async () => {
    try {
      const data = await courseApi.getAllCourses();
      setCourses(data);
    } catch (error) {
      console.error('Failed to load courses:', error);
    }
  };

  const loadCourse = async (slug) => {
    try {
      const result = await courseApi.getCourse(slug);
      setCourseData(result.data);
      setSelectedCourse(slug);
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to load course',
        color: 'red',
      });
    }
  };

  const handleCreateCourse = async () => {
    if (!newCourseSlug) return;

    setLoading(true);
    try {
      await courseApi.createCourse(newCourseSlug);
      notifications.show({
        title: 'Success',
        message: 'Course created successfully!',
        color: 'green',
      });
      setCreateModalOpened(false);
      setNewCourseSlug('');
      await loadCourses();
      await loadCourse(newCourseSlug);
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to create course',
        color: 'red',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('editor-token');
    setIsAuthenticated(false);
    setSelectedCourse(null);
    setCourseData(null);
  };

  const handleSave = async () => {
    if (!courseData) return;
    
    setSaving(true);
    try {
      await courseApi.saveCourse(courseData.slug, courseData);
      notifications.show({
        title: 'Success',
        message: 'Course saved successfully!',
        color: 'green',
      });
      loadCourses();
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to save course',
        color: 'red',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!courseData) return;
    
    if (!confirm(`Are you sure you want to delete "${courseData.slug}"?`)) {
      return;
    }

    try {
      await courseApi.deleteCourse(courseData.slug);
      notifications.show({
        title: 'Success',
        message: 'Course deleted successfully!',
        color: 'green',
      });
      setSelectedCourse(null);
      setCourseData(null);
      loadCourses();
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to delete course',
        color: 'red',
      });
    }
  };

  const handleCourseDataChange = (newData) => {
    setCourseData(newData);
  };

  const handleLogin = () => {
    setIsAuthenticated(true);
    loadCourses(); // Загружаем курсы сразу после логина
  };

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <>
      <AppShell
        header={{ height: 64 }}
        navbar={{ width: 240, breakpoint: 'sm' }}
        padding={0}
        styles={{
          main: {
            backgroundColor: '#0E0E12',
          },
        }}
      >
        <AppShell.Header
          style={{
            backgroundColor: '#18181B',
            borderBottom: '1px solid #27272A',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Box px="lg" style={{ width: '100%' }}>
            <Group justify="space-between" align="center">
              <Group gap="md" align="center">
                <Title order={4} c="#FFFFFF" fw={600}>
                  Seluna Editor
                </Title>
                {courseData && (
                  <>
                    <Box style={{ width: 1, height: 20, backgroundColor: '#27272A' }} />
                    <Breadcrumbs
                      separator={<IconChevronRight size={12} color="#71717A" />}
                      styles={{
                        separator: { marginLeft: 6, marginRight: 6 },
                      }}
                    >
                      <Anchor size="sm" c="#71717A" style={{ textDecoration: 'none' }}>
                        Courses
                      </Anchor>
                      <Text size="sm" c="#A1A1AA" fw={500}>
                        {courseData.translations?.ru?.title || courseData.slug}
                      </Text>
                    </Breadcrumbs>
                  </>
                )}
              </Group>
              <Group gap="xs">
                {courseData && (
                  <>
                    <Button
                      leftSection={<IconDeviceFloppy size={16} />}
                      onClick={handleSave}
                      loading={saving}
                      color="emerald"
                      size="sm"
                    >
                      Save Course
                    </Button>
                    <Button
                      leftSection={<IconTrash size={16} />}
                      onClick={handleDelete}
                      variant="subtle"
                      color="gray"
                      size="sm"
                      styles={{
                        root: {
                          color: '#EF4444',
                          '&:hover': {
                            backgroundColor: 'rgba(239, 68, 68, 0.1)',
                            color: '#EF4444',
                          },
                        },
                      }}
                    >
                      Delete
                    </Button>
                    <Button
                      leftSection={<IconEye size={16} />}
                      onClick={() => setPreviewOpened(true)}
                      variant="subtle"
                      color="gray"
                      size="sm"
                      styles={{
                        root: {
                          color: '#A1A1AA',
                          '&:hover': {
                            backgroundColor: '#27272A',
                            color: '#A1A1AA',
                          },
                        },
                      }}
                    >
                      Preview
                    </Button>
                  </>
                )}
                <Button
                  variant="subtle"
                  color="gray"
                  leftSection={<IconLogout size={16} />}
                  onClick={handleLogout}
                  size="sm"
                  styles={{
                    root: {
                      color: '#71717A',
                      '&:hover': {
                        backgroundColor: '#27272A',
                        color: '#71717A',
                      },
                    },
                  }}
                >
                  Logout
                </Button>
              </Group>
            </Group>
          </Box>
        </AppShell.Header>

        <AppShell.Navbar p={0}>
          <CourseList
            courses={courses}
            selectedCourse={selectedCourse}
            onSelectCourse={loadCourse}
            onCreateCourse={() => setCreateModalOpened(true)}
          />
        </AppShell.Navbar>

        <AppShell.Main>
          {courseData ? (
            <CourseEditor
              course={courseData}
              onCourseChange={handleCourseDataChange}
              previewOpened={previewOpened}
              onPreviewClose={() => setPreviewOpened(false)}
            />
          ) : (
            <Box
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: 'calc(100vh - 60px)',
                width: '100%',
              }}
            >
              <Title order={4} c="dimmed" ta="center">
                Select a course to edit or create a new one
              </Title>
            </Box>
          )}
        </AppShell.Main>
      </AppShell>

      {/* Create Course Modal */}
      <Modal
        opened={createModalOpened}
        onClose={() => setCreateModalOpened(false)}
        title={
          <Text fw={600} c="#FFFFFF">
            Create New Course
          </Text>
        }
        styles={{
          content: {
            backgroundColor: '#18181B',
          },
          header: {
            backgroundColor: '#18181B',
            borderBottom: '1px solid #27272A',
          },
          body: {
            padding: '24px',
          },
        }}
      >
        <TextInput
          label="Course Slug"
          placeholder="e.g., advanced-tarot"
          value={newCourseSlug}
          onChange={(e) => setNewCourseSlug(e.target.value)}
          mb="xl"
          size="md"
        />
        <Group justify="flex-end" gap="sm">
          <Button
            variant="subtle"
            onClick={() => setCreateModalOpened(false)}
            styles={{
              root: {
                color: '#A1A1AA',
              },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleCreateCourse}
            loading={loading}
            color="emerald"
          >
            Create Course
          </Button>
        </Group>
      </Modal>
    </>
  );
}

export default App;
