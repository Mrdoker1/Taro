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
        <Title ta="center" mb="xl" c="gold.6">
          Seluna Course Editor
        </Title>

        <Paper withBorder shadow="md" p={30} radius="md">
          <form onSubmit={handleSubmit}>
            <Stack>
              <TextInput
                label="Username"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />

              <PasswordInput
                label="Password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

            <Button type="submit" fullWidth loading={loading} color="gold">
              Login
            </Button>
            </Stack>
          </form>
        </Paper>
      </Container>
    </Box>
  );
}
