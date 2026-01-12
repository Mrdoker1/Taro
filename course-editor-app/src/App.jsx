import { useState, useEffect } from 'react';
import { AppShell, Box, Title, Button, Group, TextInput, Modal, Breadcrumbs, Anchor, Text } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconLogout, IconDeviceFloppy, IconTrash, IconEye, IconChevronRight, IconDownload } from '@tabler/icons-react';
import { Login } from './components/Login';
import { Sidebar } from './components/Sidebar';
import { CourseEditor } from './components/CourseEditor';
import { DecksEditor } from './components/DecksEditor';
import { SpreadsEditor } from './components/SpreadsEditor';
import { PromptTemplatesEditor } from './components/PromptTemplatesEditor';
import { UsersEditor } from './components/UsersEditor';
import { courseApi, decksApi, spreadsApi, promptTemplatesApi, usersApi } from './api/client';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeSection, setActiveSection] = useState('courses'); // courses, spreads, prompts
  
  // Courses
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [courseData, setCourseData] = useState(null);
  const [createModalOpened, setCreateModalOpened] = useState(false);
  const [newCourseSlug, setNewCourseSlug] = useState('');
  const [previewOpened, setPreviewOpened] = useState(false);
  const [saving, setSaving] = useState(false);
  
  // Decks
  const [decks, setDecks] = useState([]);
  const [selectedDeck, setSelectedDeck] = useState(null);
  const [deckData, setDeckData] = useState(null);
  
  // Spreads
  const [spreads, setSpreads] = useState([]);
  const [selectedSpread, setSelectedSpread] = useState(null);
  const [spreadData, setSpreadData] = useState(null);
  
  // Prompts
  const [prompts, setPrompts] = useState([]);
  const [selectedPrompt, setSelectedPrompt] = useState(null);
  const [promptData, setPromptData] = useState(null);
  
  // Users
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [usersAppFilter, setUsersAppFilter] = useState('taro'); // По умолчанию taro
  
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('editor-token');
    if (token) {
      setIsAuthenticated(true);
      loadCourses();
      loadDecks();
      loadSpreads();
      loadPrompts();
      loadUsers('taro'); // По умолчанию загружаем пользователей taro
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

  const loadDecks = async () => {
    try {
      const data = await decksApi.getAllDecks();
      setDecks(data);
    } catch (error) {
      console.error('Failed to load decks:', error);
    }
  };

  const loadSpreads = async () => {
    try {
      const data = await spreadsApi.getAllSpreads();
      setSpreads(data);
    } catch (error) {
      console.error('Failed to load spreads:', error);
    }
  };

  const loadPrompts = async () => {
    try {
      const data = await promptTemplatesApi.getAllTemplates();
      setPrompts(data);
    } catch (error) {
      console.error('Failed to load prompts:', error);
    }
  };

  const loadUsers = async (appType = '') => {
    try {
      console.log('Loading users with token:', localStorage.getItem('editor-token'));
      const data = await usersApi.getAllUsers(appType);
      console.log('Users loaded:', data);
      setUsers(data);
    } catch (error) {
      console.error('Failed to load users:', error);
      console.error('Error details:', error.response);
    }
  };

  const loadUser = (userId) => {
    const user = users.find(u => u._id === userId);
    if (user) {
      setUserData(user);
      setSelectedUser(userId);
    }
  };

  const handleUsersAppFilterChange = async (newAppType) => {
    setUsersAppFilter(newAppType);
    setSelectedUser(null);
    setUserData(null);
    await loadUsers(newAppType);
  };

  const handleCreateUser = () => {
    // Создаем "новый" пользователь для формы
    const newUser = {
      _id: 'new',
      email: '',
      username: '',
      password: '',
      role: 'user',
      isActive: true,
      appType: usersAppFilter || 'taro',
      subscriptionExpiresAt: null,
    };
    setUserData(newUser);
    setSelectedUser('new');
  };

  const handleSaveNewUser = async (userData) => {
    try {
      const createData = {
        email: userData.email,
        password: userData.password,
        username: userData.username,
        role: userData.role,
        isActive: userData.isActive,
        appType: userData.appType,
        subscriptionExpiresAt: userData.subscriptionExpiresAt,
      };
      
      await usersApi.createUser(createData);
      notifications.show({
        title: 'Успешно',
        message: 'Пользователь создан!',
        color: 'green',
      });
      setSelectedUser(null);
      setUserData(null);
      await loadUsers(usersAppFilter);
    } catch (error) {
      notifications.show({
        title: 'Ошибка',
        message: error.response?.data?.message || 'Не удалось создать пользователя',
        color: 'red',
      });
    }
  };

  const handleUserDataChange = (newData) => {
    setUserData(newData);
  };

  const handleSaveUser = async () => {
    if (!userData) return;
    
    // Если это новый пользователь
    if (selectedUser === 'new') {
      setSaving(true);
      try {
        await handleSaveNewUser(userData);
      } finally {
        setSaving(false);
      }
      return;
    }
    
    // Обновление существующего пользователя
    setSaving(true);
    try {
      const updateData = {
        username: userData.username,
        role: userData.role,
        isActive: userData.isActive,
        subscriptionExpiresAt: userData.subscriptionExpiresAt,
      };
      
      await usersApi.updateUser(userData._id, updateData);
      notifications.show({
        title: 'Успешно',
        message: 'Пользователь обновлен!',
        color: 'green',
      });
      await loadUsers(usersAppFilter);
      loadUser(userData._id); // Reload user data
    } catch (error) {
      notifications.show({
        title: 'Ошибка',
        message: 'Не удалось обновить пользователя',
        color: 'red',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!userData || !confirm(`Удалить пользователя ${userData.email}?`)) return;
    
    try {
      await usersApi.deleteUser(userData._id);
      notifications.show({
        title: 'Успешно',
        message: 'Пользователь удален!',
        color: 'green',
      });
      setSelectedUser(null);
      setUserData(null);
      await loadUsers();
    } catch (error) {
      notifications.show({
        title: 'Ошибка',
        message: 'Не удалось удалить пользователя',
        color: 'red',
      });
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

  const handleDownloadCourseJSON = () => {
    if (!courseData) return;
    
    const dataStr = JSON.stringify(courseData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `course-${courseData.key || courseData.slug || 'backup'}-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    notifications.show({
      title: 'Успех',
      message: 'Курс скачан в формате JSON',
      color: 'green',
    });
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

  const handleSpreadDataChange = (newData) => {
    setSpreadData(newData);
  };

  const handlePromptDataChange = (newData) => {
    setPromptData(newData);
  };

  const handleDeckDataChange = (newData) => {
    setDeckData(newData);
  };

  const handleSaveSpread = async () => {
    if (!spreadData) return;
    
    setSaving(true);
    try {
      if (selectedSpread === 'new') {
        await spreadsApi.createSpread(spreadData);
        await loadSpreads();
        setSelectedSpread(spreadData.key);
      } else {
        await spreadsApi.updateSpread(spreadData.key, spreadData);
      }
      notifications.show({
        title: 'Успешно',
        message: 'Расклад сохранен!',
        color: 'green',
      });
    } catch (error) {
      notifications.show({
        title: 'Ошибка',
        message: 'Не удалось сохранить расклад',
        color: 'red',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDownloadSpreadJSON = () => {
    if (!spreadData) return;
    
    const dataStr = JSON.stringify(spreadData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `spread-${spreadData.key || 'backup'}-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    notifications.show({
      title: 'Успех',
      message: 'Расклад скачан в формате JSON',
      color: 'green',
    });
  };

  const handleDeleteSpread = async () => {
    if (!spreadData || !confirm('Удалить этот расклад?')) return;
    
    try {
      await spreadsApi.deleteSpread(spreadData.key);
      notifications.show({
        title: 'Успешно',
        message: 'Расклад удален!',
        color: 'green',
      });
      setSelectedSpread(null);
      setSpreadData(null);
      await loadSpreads();
    } catch (error) {
      notifications.show({
        title: 'Ошибка',
        message: 'Не удалось удалить расклад',
        color: 'red',
      });
    }
  };

  const handleSavePrompt = async () => {
    if (!promptData) return;
    
    setSaving(true);
    try {
      if (selectedPrompt === 'new') {
        await promptTemplatesApi.createTemplate(promptData);
        await loadPrompts();
        setSelectedPrompt(promptData.key);
      } else {
        await promptTemplatesApi.updateTemplate(promptData.key, promptData);
      }
      notifications.show({
        title: 'Успешно',
        message: 'Шаблон сохранен!',
        color: 'green',
      });
    } catch (error) {
      notifications.show({
        title: 'Ошибка',
        message: 'Не удалось сохранить шаблон',
        color: 'red',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDownloadPromptJSON = () => {
    if (!promptData) return;
    
    const dataStr = JSON.stringify(promptData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `prompt-${promptData.key || 'backup'}-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    notifications.show({
      title: 'Успех',
      message: 'Промпт-шаблон скачан в формате JSON',
      color: 'green',
    });
  };

  const handleDeletePrompt = async () => {
    if (!promptData || !confirm('Удалить этот шаблон?')) return;
    
    try {
      await promptTemplatesApi.deleteTemplate(promptData.key);
      notifications.show({
        title: 'Успешно',
        message: 'Шаблон удален!',
        color: 'green',
      });
      setSelectedPrompt(null);
      setPromptData(null);
      await loadPrompts();
    } catch (error) {
      notifications.show({
        title: 'Ошибка',
        message: 'Не удалось удалить шаблон',
        color: 'red',
      });
    }
  };

  const handleSaveDeck = async () => {
    if (!deckData) return;
    
    setSaving(true);
    try {
      if (selectedDeck === 'new') {
        await decksApi.createDeck(deckData);
        await loadDecks();
        setSelectedDeck(deckData.key);
      } else {
        await decksApi.updateDeck(deckData.key, deckData);
      }
      notifications.show({
        title: 'Успешно',
        message: 'Колода сохранена!',
        color: 'green',
      });
    } catch (error) {
      notifications.show({
        title: 'Ошибка',
        message: 'Не удалось сохранить колоду',
        color: 'red',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDownloadDeckJSON = () => {
    if (!deckData) return;
    
    const dataStr = JSON.stringify(deckData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `deck-${deckData.key || 'backup'}-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    notifications.show({
      title: 'Успех',
      message: 'Колода скачана в формате JSON',
      color: 'green',
    });
  };

  const handleDeleteDeck = async () => {
    if (!deckData || !confirm('Удалить эту колоду?')) return;
    
    try {
      await decksApi.deleteDeck(deckData.key);
      notifications.show({
        title: 'Успешно',
        message: 'Колода удалена!',
        color: 'green',
      });
      setSelectedDeck(null);
      setDeckData(null);
      await loadDecks();
    } catch (error) {
      notifications.show({
        title: 'Ошибка',
        message: 'Не удалось удалить колоду',
        color: 'red',
      });
    }
  };

  const handleLogin = () => {
    setIsAuthenticated(true);
    loadCourses();
    loadDecks();
    loadSpreads();
    loadPrompts();
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
                {/* Breadcrumbs для курсов */}
                {courseData && activeSection === 'courses' && (
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
                
                {/* Breadcrumbs для колод */}
                {deckData && activeSection === 'decks' && (
                  <>
                    <Box style={{ width: 1, height: 20, backgroundColor: '#27272A' }} />
                    <Breadcrumbs
                      separator={<IconChevronRight size={12} color="#71717A" />}
                      styles={{
                        separator: { marginLeft: 6, marginRight: 6 },
                      }}
                    >
                      <Anchor size="sm" c="#71717A" style={{ textDecoration: 'none' }}>
                        Колоды
                      </Anchor>
                      <Text size="sm" c="#A1A1AA" fw={500}>
                        {deckData.translations?.ru?.name || deckData.key || 'Новая колода'}
                      </Text>
                    </Breadcrumbs>
                  </>
                )}
                
                {/* Breadcrumbs для раскладов */}
                {spreadData && activeSection === 'spreads' && (
                  <>
                    <Box style={{ width: 1, height: 20, backgroundColor: '#27272A' }} />
                    <Breadcrumbs
                      separator={<IconChevronRight size={12} color="#71717A" />}
                      styles={{
                        separator: { marginLeft: 6, marginRight: 6 },
                      }}
                    >
                      <Anchor size="sm" c="#71717A" style={{ textDecoration: 'none' }}>
                        Расклады
                      </Anchor>
                      <Text size="sm" c="#A1A1AA" fw={500}>
                        {spreadData.translations?.ru?.name || spreadData.key || 'Новый расклад'}
                      </Text>
                    </Breadcrumbs>
                  </>
                )}
                
                {/* Breadcrumbs для промпт-шаблонов */}
                {promptData && activeSection === 'prompts' && (
                  <>
                    <Box style={{ width: 1, height: 20, backgroundColor: '#27272A' }} />
                    <Breadcrumbs
                      separator={<IconChevronRight size={12} color="#71717A" />}
                      styles={{
                        separator: { marginLeft: 6, marginRight: 6 },
                      }}
                    >
                      <Anchor size="sm" c="#71717A" style={{ textDecoration: 'none' }}>
                        Промпт-шаблоны
                      </Anchor>
                      <Text size="sm" c="#A1A1AA" fw={500}>
                        {promptData.key || 'Новый шаблон'}
                      </Text>
                    </Breadcrumbs>
                  </>
                )}
              </Group>
              <Group gap="xs">
                {/* Course buttons */}
                {courseData && activeSection === 'courses' && (
                  <>
                    <Button
                      leftSection={<IconDeviceFloppy size={16} />}
                      onClick={handleSave}
                      loading={saving}
                      color="violet"
                      size="sm"
                    >
                      Save Course
                    </Button>
                    <Button
                      leftSection={<IconDownload size={16} />}
                      onClick={handleDownloadCourseJSON}
                      variant="light"
                      color="blue"
                      size="sm"
                    >
                      Download JSON
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
                
                {/* Deck buttons */}
                {deckData && activeSection === 'decks' && (
                  <>
                    <Button
                      leftSection={<IconDeviceFloppy size={16} />}
                      onClick={handleSaveDeck}
                      loading={saving}
                      color="violet"
                      size="sm"
                    >
                      Сохранить
                    </Button>
                    <Button
                      leftSection={<IconDownload size={16} />}
                      onClick={handleDownloadDeckJSON}
                      variant="light"
                      color="blue"
                      size="sm"
                    >
                      Download JSON
                    </Button>
                    {selectedDeck !== 'new' && (
                      <Button
                        leftSection={<IconTrash size={16} />}
                        onClick={handleDeleteDeck}
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
                        Удалить
                      </Button>
                    )}
                  </>
                )}
                
                {/* Spread buttons */}
                {spreadData && activeSection === 'spreads' && (
                  <>
                    <Button
                      leftSection={<IconDeviceFloppy size={16} />}
                      onClick={handleSaveSpread}
                      loading={saving}
                      color="violet"
                      size="sm"
                    >
                      Сохранить
                    </Button>
                    <Button
                      leftSection={<IconDownload size={16} />}
                      onClick={handleDownloadSpreadJSON}
                      variant="light"
                      color="blue"
                      size="sm"
                    >
                      Download JSON
                    </Button>
                    {selectedSpread !== 'new' && (
                      <Button
                        leftSection={<IconTrash size={16} />}
                        onClick={handleDeleteSpread}
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
                        Удалить
                      </Button>
                    )}
                  </>
                )}
                
                {/* Prompt buttons */}
                {promptData && activeSection === 'prompts' && (
                  <>
                    <Button
                      leftSection={<IconDeviceFloppy size={16} />}
                      onClick={handleSavePrompt}
                      loading={saving}
                      color="violet"
                      size="sm"
                    >
                      Сохранить
                    </Button>
                    <Button
                      leftSection={<IconDownload size={16} />}
                      onClick={handleDownloadPromptJSON}
                      variant="light"
                      color="blue"
                      size="sm"
                    >
                      Download JSON
                    </Button>
                    {selectedPrompt !== 'new' && (
                      <Button
                        leftSection={<IconTrash size={16} />}
                        onClick={handleDeletePrompt}
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
                        Удалить
                      </Button>
                    )}
                  </>
                )}

                {/* User buttons */}
                {userData && activeSection === 'users' && (
                  <>
                    <Button
                      leftSection={<IconDeviceFloppy size={16} />}
                      onClick={handleSaveUser}
                      loading={saving}
                      color="violet"
                      size="sm"
                    >
                      Сохранить
                    </Button>
                    <Button
                      leftSection={<IconTrash size={16} />}
                      onClick={handleDeleteUser}
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
                      Удалить
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
          <Sidebar
            activeSection={activeSection}
            onSectionChange={(value) => {
              setActiveSection(value);
              setSelectedCourse(null);
              setCourseData(null);
              setSelectedDeck(null);
              setDeckData(null);
              setSelectedSpread(null);
              setSelectedPrompt(null);
              setSelectedUser(null);
              setUserData(null);
            }}
            // Courses
            courses={courses}
            selectedCourse={selectedCourse}
            onSelectCourse={loadCourse}
            onCreateCourse={() => setCreateModalOpened(true)}
            // Decks
            decks={decks}
            selectedDeck={selectedDeck}
            onSelectDeck={(key) => setSelectedDeck(key)}
            onCreateDeck={() => setSelectedDeck('new')}
            // Spreads
            spreads={spreads}
            selectedSpread={selectedSpread}
            onSelectSpread={(key) => setSelectedSpread(key)}
            onCreateSpread={() => setSelectedSpread('new')}
            // Prompts
            prompts={prompts}
            selectedPrompt={selectedPrompt}
            onSelectPrompt={(key) => setSelectedPrompt(key)}
            onCreatePrompt={() => setSelectedPrompt('new')}
            // Users
            users={users}
            selectedUser={selectedUser}
            onSelectUser={loadUser}
            onCreateUser={handleCreateUser}
            usersAppFilter={usersAppFilter}
            onUsersAppFilterChange={handleUsersAppFilterChange}
          />
        </AppShell.Navbar>

        <AppShell.Main>
          {activeSection === 'courses' && (
            courseData ? (
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
            )
          )}
          {activeSection === 'decks' && (
            <DecksEditor 
              selectedDeck={selectedDeck}
              deckData={deckData}
              onDeckChange={handleDeckDataChange}
            />
          )}
          {activeSection === 'spreads' && (
            <SpreadsEditor 
              selectedSpread={selectedSpread}
              spreadData={spreadData}
              onSpreadChange={handleSpreadDataChange}
            />
          )}
          {activeSection === 'prompts' && (
            <PromptTemplatesEditor 
              selectedPrompt={selectedPrompt}
              promptData={promptData}
              onPromptChange={handlePromptDataChange}
            />
          )}

          {activeSection === 'users' && (
            <UsersEditor
              selectedUser={selectedUser}
              userData={userData}
              onUserChange={handleUserDataChange}
            />
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
            color="violet"
          >
            Create Course
          </Button>
        </Group>
      </Modal>
    </>
  );
}

export default App;
