import { useState, useEffect } from 'react';
import { AppShell, Box, Title, Button, Group, TextInput, Modal } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconLogout, IconDeviceFloppy, IconTrash, IconEye } from '@tabler/icons-react';
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
        header={{ height: 60 }}
        navbar={{ width: 300, breakpoint: 'sm' }}
        padding={0}
      >
        <AppShell.Header
          style={{
            backgroundColor: 'var(--mantine-color-dark-8)',
            borderBottom: '1px solid var(--mantine-color-dark-6)',
          }}
        >
          <Group h="100%" px="md" justify="space-between">
            <Title order={3} c="gold.6">
              Seluna Course Editor
            </Title>
            <Group>
              {courseData && (
                <>
                  <Button
                    leftSection={<IconDeviceFloppy size={18} />}
                    onClick={handleSave}
                    loading={saving}
                    color="green"
                  >
                    Save
                  </Button>
                  <Button
                    leftSection={<IconTrash size={18} />}
                    onClick={handleDelete}
                    color="red"
                    variant="light"
                  >
                    Delete
                  </Button>
                  <Button
                    leftSection={<IconEye size={18} />}
                    onClick={() => setPreviewOpened(true)}
                    color="violet"
                    variant="light"
                  >
                    Preview
                  </Button>
                </>
              )}
              <Button
                variant="subtle"
                leftSection={<IconLogout size={18} />}
                onClick={handleLogout}
              >
                Logout
              </Button>
            </Group>
          </Group>
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
        title="Create New Course"
      >
        <TextInput
          label="Course Slug"
          placeholder="e.g., advanced-tarot"
          value={newCourseSlug}
          onChange={(e) => setNewCourseSlug(e.target.value)}
          mb="md"
        />
        <Group justify="flex-end">
          <Button variant="subtle" onClick={() => setCreateModalOpened(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleCreateCourse}
            loading={loading}
            color="gold"
          >
            Create
          </Button>
        </Group>
      </Modal>
    </>
  );
}

export default App;
