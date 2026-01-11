import { useState } from 'react';
import { Box, Container, Paper, Title, TextInput, PasswordInput, Button, Stack } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { courseApi } from '../api/client';

export function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await courseApi.login(username, password);
      if (result.success && result.token) {
        localStorage.setItem('editor-token', result.token);
        notifications.show({
          title: 'Success',
          message: 'Login successful!',
          color: 'green',
        });
        onLogin();
      }
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Invalid credentials',
        color: 'red',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        width: '100%',
      }}
    >
      <Container size={420}>
        <Title ta="center" mb="xl" c="#10B981" fw={700}>
          Seluna Editor
        </Title>

        <Paper
          shadow="xl"
          p={40}
          radius="lg"
          style={{
            backgroundColor: '#18181B',
            border: '1px solid #27272A',
          }}
        >
          <form onSubmit={handleSubmit}>
            <Stack gap="lg">
              <TextInput
                label="Username"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                size="md"
              />

              <PasswordInput
                label="Password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                size="md"
              />

              <Button
                type="submit"
                fullWidth
                loading={loading}
                color="emerald"
                size="md"
                mt="md"
              >
                Login
              </Button>
            </Stack>
          </form>
        </Paper>
      </Container>
    </Box>
  );
}
