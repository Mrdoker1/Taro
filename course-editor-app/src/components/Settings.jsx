import { useState } from 'react';
import { Container, Paper, Title, Stack, PasswordInput, Button, Text, Group } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconKey, IconArrowLeft } from '@tabler/icons-react';
import { courseApi } from '../api/client';

export function Settings({ onBack }) {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChangePassword = async (e) => {
    e.preventDefault();

    // Валидация
    if (!oldPassword || !newPassword || !confirmPassword) {
      notifications.show({
        title: 'Ошибка',
        message: 'Заполните все поля',
        color: 'red',
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      notifications.show({
        title: 'Ошибка',
        message: 'Новые пароли не совпадают',
        color: 'red',
      });
      return;
    }

    if (newPassword.length < 6) {
      notifications.show({
        title: 'Ошибка',
        message: 'Пароль должен содержать минимум 6 символов',
        color: 'red',
      });
      return;
    }

    setLoading(true);

    try {
      await courseApi.changePassword(oldPassword, newPassword);
      
      notifications.show({
        title: 'Успешно',
        message: 'Пароль успешно изменен',
        color: 'green',
      });

      // Очищаем поля
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      console.error('Failed to change password:', error);
      
      const message = error.response?.data?.message || 'Неверный старый пароль';
      
      notifications.show({
        title: 'Ошибка',
        message,
        color: 'red',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container size="sm" py="xl">
      <Group mb="xl">
        <Button
          variant="subtle"
          leftSection={<IconArrowLeft size={16} />}
          onClick={onBack}
          color="gray"
        >
          Назад
        </Button>
      </Group>

      <Paper
        shadow="md"
        p="xl"
        radius="md"
        style={{
          backgroundColor: '#18181B',
          border: '1px solid #27272A',
        }}
      >
        <Group mb="xl">
          <IconKey size={28} style={{ color: '#8B5CF6' }} />
          <Title order={2} c="#8B5CF6">
            Настройки безопасности
          </Title>
        </Group>

        <form onSubmit={handleChangePassword}>
          <Stack gap="lg">
            <div>
              <Text size="sm" fw={500} mb="xs" c="gray.4">
                Смена пароля администратора
              </Text>
              <Text size="xs" c="dimmed" mb="md">
                Пароль должен содержать минимум 6 символов
              </Text>
            </div>

            <PasswordInput
              label="Текущий пароль"
              placeholder="Введите текущий пароль"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              required
              size="md"
            />

            <PasswordInput
              label="Новый пароль"
              placeholder="Введите новый пароль"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              size="md"
            />

            <PasswordInput
              label="Подтвердите новый пароль"
              placeholder="Повторите новый пароль"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              size="md"
            />

            <Button
              type="submit"
              fullWidth
              loading={loading}
              color="violet"
              size="md"
              mt="md"
              leftSection={<IconKey size={16} />}
            >
              Изменить пароль
            </Button>
          </Stack>
        </form>
      </Paper>
    </Container>
  );
}
