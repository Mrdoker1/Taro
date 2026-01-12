import { useState, useEffect } from 'react';
import { Box, Title, Text, Paper, Stack, TextInput, Select, Switch, Group, ScrollArea, Button } from '@mantine/core';
import { IconMail, IconKey } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import { usersApi } from '../api/client';

export function UsersEditor({ selectedUser, userData, onUserChange }) {
  const [localData, setLocalData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (userData) {
      setLocalData(userData);
    }
  }, [userData]);

  const isNewUser = selectedUser === 'new';

  const handleChange = (newData) => {
    setLocalData(newData);
    onUserChange(newData);
  };

  const handleSendConfirmation = async () => {
    if (!localData._id || isNewUser) return;
    
    try {
      const result = await usersApi.sendConfirmationEmail(localData._id);
      notifications.show({
        title: 'Успешно',
        message: result.message || 'Письмо подтверждения отправлено на ' + localData.email,
        color: 'green',
      });
    } catch (error) {
      console.error('Error sending confirmation:', error);
      notifications.show({
        title: 'Ошибка',
        message: error.response?.data?.message || error.message || 'Не удалось отправить письмо',
        color: 'red',
      });
    }
  };

  const handleSendPasswordReset = async () => {
    if (!localData._id || isNewUser) return;
    
    try {
      const result = await usersApi.sendPasswordResetEmail(localData._id);
      notifications.show({
        title: 'Успешно',
        message: result.message || 'Письмо для сброса пароля отправлено на ' + localData.email,
        color: 'green',
      });
    } catch (error) {
      console.error('Error sending password reset:', error);
      notifications.show({
        title: 'Ошибка',
        message: error.response?.data?.message || error.message || 'Не удалось отправить письмо',
        color: 'red',
      });
    }
  };

  if (!localData) {
    return (
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
          Выберите пользователя для редактирования
        </Title>
      </Box>
    );
  }

  if (loading) {
    return (
      <Box
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: 'calc(100vh - 60px)',
        }}
      >
        <Text c="dimmed">Загрузка...</Text>
      </Box>
    );
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'Не указана';
    return new Date(dateString).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isSubscriptionActive = (expiresAt) => {
    if (!expiresAt) return false;
    return new Date(expiresAt) > new Date();
  };

  return (
    <ScrollArea h="calc(100vh - 64px)">
      <Box p="xl">
        <Paper
          p="xl"
          mb="xl"
          style={{
            backgroundColor: '#111114',
            border: '1px solid #27272A',
            borderRadius: '12px',
          }}
        >
          <Title order={3} c="#10B981" mb="lg">
            {isNewUser ? 'Создание пользователя' : 'Основная информация'}
          </Title>

          <Stack gap="md">
            <TextInput
              label="Email"
              value={localData.email || ''}
              onChange={(e) => handleChange({ ...localData, email: e.target.value })}
              disabled={!isNewUser}
              placeholder={isNewUser ? "user@example.com" : ""}
              required={isNewUser}
              styles={!isNewUser ? {
                input: {
                  backgroundColor: '#18181B',
                  borderColor: '#27272A',
                  color: '#71717A',
                }
              } : {}}
            />

            {isNewUser && (
              <TextInput
                label="Пароль"
                type="password"
                value={localData.password || ''}
                onChange={(e) => handleChange({ ...localData, password: e.target.value })}
                placeholder="Минимум 6 символов"
                required
              />
            )}

            <TextInput
              label="Имя пользователя"
              value={localData.username || ''}
              onChange={(e) => handleChange({ ...localData, username: e.target.value })}
              placeholder="Не указано"
            />

            <Group grow>
              <Select
                label="Роль"
                value={localData.role || 'user'}
                onChange={(value) => handleChange({ ...localData, role: value })}
                data={[
                  { value: 'user', label: 'User' },
                  { value: 'admin', label: 'Admin' },
                ]}
              />

              {isNewUser ? (
                <Select
                  label="Приложение"
                  value={localData.appType || 'taro'}
                  onChange={(value) => handleChange({ ...localData, appType: value })}
                  data={[
                    { value: 'taro', label: 'Taro' },
                    { value: 'doc-scan', label: 'Doc Scan' },
                  ]}
                  required
                />
              ) : (
                <TextInput
                  label="Приложение"
                  value={localData.appType || ''}
                  disabled
                  styles={{
                    input: {
                      backgroundColor: '#18181B',
                      borderColor: '#27272A',
                      color: '#71717A',
                    }
                  }}
                />
              )}
            </Group>

            <Group grow>
              <Switch
                label="Аккаунт активен"
                checked={localData.isActive || false}
                onChange={(e) => handleChange({ ...localData, isActive: e.currentTarget.checked })}
              />
            </Group>
          </Stack>
        </Paper>

        <Paper
          p="xl"
          mb="xl"
          style={{
            backgroundColor: '#111114',
            border: '1px solid #27272A',
            borderRadius: '12px',
          }}
        >
          <Title order={3} c="#10B981" mb="lg">
            Подписка
          </Title>

          <Stack gap="md">
            <Group>
              <Text size="sm" c="dimmed">Статус подписки:</Text>
              <Text 
                size="sm" 
                fw={500}
                c={isSubscriptionActive(localData.subscriptionExpiresAt) ? 'green' : 'red'}
              >
                {isSubscriptionActive(localData.subscriptionExpiresAt) ? 'Активна' : 'Неактивна'}
              </Text>
            </Group>

            {localData.subscriptionExpiresAt && (
              <Group>
                <Text size="sm" c="dimmed">Дата окончания:</Text>
                <Text size="sm">{formatDate(localData.subscriptionExpiresAt)}</Text>
              </Group>
            )}

            <Box>
              <Text size="sm" fw={500} mb="xs">Быстрый выбор периода:</Text>
              <Group gap="xs">
                <Button
                  size="xs"
                  variant="light"
                  color="blue"
                  onClick={() => {
                    const newDate = new Date();
                    newDate.setMonth(newDate.getMonth() + 1);
                    handleChange({ ...localData, subscriptionExpiresAt: newDate.toISOString() });
                  }}
                >
                  +1 месяц
                </Button>
                <Button
                  size="xs"
                  variant="light"
                  color="blue"
                  onClick={() => {
                    const newDate = new Date();
                    newDate.setMonth(newDate.getMonth() + 3);
                    handleChange({ ...localData, subscriptionExpiresAt: newDate.toISOString() });
                  }}
                >
                  +3 месяца
                </Button>
                <Button
                  size="xs"
                  variant="light"
                  color="blue"
                  onClick={() => {
                    const newDate = new Date();
                    newDate.setMonth(newDate.getMonth() + 6);
                    handleChange({ ...localData, subscriptionExpiresAt: newDate.toISOString() });
                  }}
                >
                  +6 месяцев
                </Button>
                <Button
                  size="xs"
                  variant="light"
                  color="blue"
                  onClick={() => {
                    const newDate = new Date();
                    newDate.setFullYear(newDate.getFullYear() + 1);
                    handleChange({ ...localData, subscriptionExpiresAt: newDate.toISOString() });
                  }}
                >
                  +1 год
                </Button>
                <Button
                  size="xs"
                  variant="light"
                  color="cyan"
                  onClick={() => {
                    const newDate = new Date();
                    newDate.setFullYear(newDate.getFullYear() + 100);
                    handleChange({ ...localData, subscriptionExpiresAt: newDate.toISOString() });
                  }}
                >
                  Навсегда
                </Button>
              </Group>
            </Box>

            <Box>
              <Text size="sm" fw={500} mb="xs">Или установите дату вручную:</Text>
              <TextInput
                type="date"
                value={
                  localData.subscriptionExpiresAt 
                    ? new Date(localData.subscriptionExpiresAt).toISOString().split('T')[0]
                    : ''
                }
                onChange={(e) => {
                  const newDate = e.target.value ? new Date(e.target.value).toISOString() : null;
                  handleChange({ ...localData, subscriptionExpiresAt: newDate });
                }}
              />
            </Box>

            {localData.subscriptionExpiresAt && (
              <Button
                size="xs"
                variant="subtle"
                color="red"
                onClick={() => handleChange({ ...localData, subscriptionExpiresAt: null })}
              >
                Удалить подписку
              </Button>
            )}
          </Stack>
        </Paper>

        {!isNewUser && (
          <Paper
            p="xl"
            mb="xl"
            style={{
              backgroundColor: '#111114',
              border: '1px solid #27272A',
              borderRadius: '12px',
            }}
          >
            <Title order={3} c="#10B981" mb="lg">
              Email уведомления
            </Title>

            <Stack gap="md">
              <Box>
                <Text size="sm" fw={500} mb="xs">Подтверждение аккаунта</Text>
                <Text size="xs" c="dimmed" mb="sm">
                  Отправить письмо с ссылкой для подтверждения email адреса
                </Text>
                <Button
                  leftSection={<IconMail size={16} />}
                  variant="light"
                  color="blue"
                  size="sm"
                  onClick={handleSendConfirmation}
                >
                  Отправить подтверждение
                </Button>
              </Box>

              <Box
                style={{
                  borderTop: '1px solid #27272A',
                  paddingTop: '1rem',
                }}
              >
                <Text size="sm" fw={500} mb="xs">Сброс пароля</Text>
                <Text size="xs" c="dimmed" mb="sm">
                  Отправить письмо с ссылкой для сброса пароля (действительна 15 минут)
                </Text>
                <Button
                  leftSection={<IconKey size={16} />}
                  variant="light"
                  color="orange"
                  size="sm"
                  onClick={handleSendPasswordReset}
                >
                  Отправить сброс пароля
                </Button>
              </Box>
            </Stack>
          </Paper>
        )}

        {!isNewUser && (
          <Paper
            p="xl"
            style={{
              backgroundColor: '#111114',
              border: '1px solid #27272A',
              borderRadius: '12px',
            }}
          >
            <Title order={3} c="#10B981" mb="lg">
              Системная информация
            </Title>

            <Stack gap="md">
              <Group>
                <Text size="sm" c="dimmed">Дата регистрации:</Text>
                <Text size="sm">{formatDate(localData.createdAt)}</Text>
              </Group>

              <Group>
                <Text size="sm" c="dimmed">Последнее обновление:</Text>
                <Text size="sm">{formatDate(localData.updatedAt)}</Text>
              </Group>

              {localData._id && (
                <Group>
                  <Text size="sm" c="dimmed">ID:</Text>
                  <Text size="sm" style={{ fontFamily: 'monospace' }}>{localData._id}</Text>
                </Group>
              )}
            </Stack>
          </Paper>
        )}
      </Box>
    </ScrollArea>
  );
}
