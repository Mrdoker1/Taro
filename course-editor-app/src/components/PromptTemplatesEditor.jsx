import { useState, useEffect } from 'react';
import { Box, Title, Text, Paper, Stack, Group, TextInput, Textarea, NumberInput, Select, ScrollArea } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { promptTemplatesApi } from '../api/client';

export function PromptTemplatesEditor({ selectedPrompt, promptData, onPromptChange }) {
  const [localData, setLocalData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedPrompt && selectedPrompt !== 'new') {
      loadPrompt(selectedPrompt);
    } else if (selectedPrompt === 'new') {
      const newData = {
        key: '',
        temperature: 0.7,
        maxTokens: 800,
        systemPrompt: '',
        prompt: '',
        responseLang: 'russian',
      };
      setLocalData(newData);
      onPromptChange(newData);
    } else {
      setLocalData(null);
      onPromptChange(null);
    }
  }, [selectedPrompt]);

  useEffect(() => {
    if (promptData) {
      setLocalData(promptData);
    }
  }, [promptData]);

  const loadPrompt = async (key) => {
    try {
      setLoading(true);
      const data = await promptTemplatesApi.getTemplate(key);
      console.log('Prompt data:', data);
      setLocalData(data);
      onPromptChange(data);
    } catch (error) {
      console.error('Error loading prompt:', error);
      notifications.show({
        title: 'Ошибка',
        message: 'Не удалось загрузить шаблон',
        color: 'red',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (newData) => {
    setLocalData(newData);
    onPromptChange(newData);
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
          Выберите промпт-шаблон для редактирования или создайте новый
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
            Основная информация
          </Title>

          <Stack gap="md">
            <TextInput
              label="Key (идентификатор)"
              value={localData.key || ''}
              onChange={(e) => handleChange({ ...localData, key: e.target.value })}
              placeholder="one-card"
              required
              disabled={selectedPrompt !== 'new'}
            />

            <Group grow>
              <NumberInput
                label="Temperature"
                value={localData.temperature || 0.7}
                onChange={(value) => handleChange({ ...localData, temperature: value })}
                min={0}
                max={2}
                step={0.1}
                decimalScale={2}
              />
              <NumberInput
                label="Max Tokens"
                value={localData.maxTokens || 800}
                onChange={(value) => handleChange({ ...localData, maxTokens: value })}
                min={100}
                max={10000}
                step={100}
              />
            </Group>

            <Select
              label="Response Language"
              value={localData.responseLang || 'russian'}
              onChange={(value) => handleChange({ ...localData, responseLang: value })}
              data={[
                { value: 'russian', label: 'Русский' },
                { value: 'english', label: 'English' },
              ]}
            />
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
            Промпты
          </Title>

          <Stack gap="md">
            <Textarea
              label="System Prompt"
              value={localData.systemPrompt || ''}
              onChange={(e) => handleChange({ ...localData, systemPrompt: e.target.value })}
              placeholder="Ты — профессиональный таролог..."
              minRows={8}
              autosize
              required
            />

            <Textarea
              label="Prompt (опционально)"
              value={localData.prompt || ''}
              onChange={(e) => handleChange({ ...localData, prompt: e.target.value })}
              placeholder="Пример запроса..."
              minRows={4}
              autosize
            />
          </Stack>
        </Paper>
      </Box>
    </ScrollArea>
  );
}
