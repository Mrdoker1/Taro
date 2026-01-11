import { useState, useEffect } from 'react';
import { Box, Title, Text, Paper, Stack, TextInput, Textarea, NumberInput, Switch, Group, Tabs, ScrollArea, Select, Button, ActionIcon } from '@mantine/core';
import { IconPlus, IconTrash } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import { spreadsApi, promptTemplatesApi } from '../api/client';
import { ImagePreviewInput } from './ImagePreviewInput';

export function SpreadsEditor({ selectedSpread, spreadData, onSpreadChange }) {
  const [promptTemplates, setPromptTemplates] = useState([]);
  const [localData, setLocalData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadPromptTemplates();
  }, []);

  useEffect(() => {
    if (selectedSpread && selectedSpread !== 'new') {
      loadSpread(selectedSpread);
    } else if (selectedSpread === 'new') {
      const newData = {
        key: '',
        available: true,
        paid: false,
        cardsCount: 1,
        translations: {
          ru: { name: '', description: '' },
          en: { name: '', description: '' },
        },
        questions: { ru: [], en: [] },
        grid: [[1]],
        meta: {},
        imageURL: '',
        promptTemplateKey: '',
      };
      setLocalData(newData);
      onSpreadChange(newData);
    } else {
      setLocalData(null);
      onSpreadChange(null);
    }
  }, [selectedSpread]);

  const loadPromptTemplates = async () => {
    try {
      const data = await promptTemplatesApi.getAllTemplates();
      setPromptTemplates(data || []);
    } catch (error) {
      console.error('Error loading prompt templates:', error);
    }
  };

  useEffect(() => {
    if (spreadData) {
      setLocalData(spreadData);
    }
  }, [spreadData]);

  const loadSpread = async (key) => {
    try {
      setLoading(true);
      const data = await spreadsApi.getSpreadRaw(key);
      console.log('Spread data:', data);
      setLocalData(data);
      onSpreadChange(data);
    } catch (error) {
      console.error('Error loading spread:', error);
      notifications.show({
        title: 'Ошибка',
        message: 'Не удалось загрузить расклад',
        color: 'red',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (newData) => {
    setLocalData(newData);
    onSpreadChange(newData);
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
          Выберите расклад для редактирования или создайте новый
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
              disabled={selectedSpread !== 'new'}
            />

            <Group grow>
              <NumberInput
                label="Количество карт"
                value={localData.cardsCount || 1}
                onChange={(value) => handleChange({ ...localData, cardsCount: value })}
                min={1}
                max={78}
              />
              <ImagePreviewInput
                label="Image URL"
                value={localData.imageURL || ''}
                onChange={(e) => handleChange({ ...localData, imageURL: e.target.value })}
                placeholder="https://..."
              />
            </Group>

            <Select
              label="Промпт-шаблон"
              placeholder="Выберите промпт-шаблон"
              value={localData.promptTemplateKey || ''}
              onChange={(value) => handleChange({ ...localData, promptTemplateKey: value })}
              data={promptTemplates.map(pt => ({ value: pt.key, label: pt.key }))}
              clearable
              searchable
            />

            <Group grow>
              <Switch
                label="Доступен"
                checked={localData.available}
                onChange={(e) => handleChange({ ...localData, available: e.currentTarget.checked })}
              />
              <Switch
                label="Платный"
                checked={localData.paid}
                onChange={(e) => handleChange({ ...localData, paid: e.currentTarget.checked })}
              />
            </Group>
          </Stack>
        </Paper>

        <Paper
          p="xl"
          style={{
            backgroundColor: '#111114',
            border: '1px solid #27272A',
            borderRadius: '12px',
          }}
        >
          <Title order={3} c="#10B981" mb="lg">
            Переводы
          </Title>

          <Tabs defaultValue="ru">
            <Tabs.List>
              <Tabs.Tab value="ru">Русский</Tabs.Tab>
              <Tabs.Tab value="en">English</Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel value="ru" pt="md">
              <Stack gap="md">
                <TextInput
                  label="Название"
                  value={localData.translations?.ru?.name || ''}
                  onChange={(e) => handleChange({
                    ...localData,
                    translations: {
                      ...localData.translations,
                      ru: { ...(localData.translations?.ru || {}), name: e.target.value }
                    }
                  })}
                  required
                />
                <Textarea
                  label="Описание"
                  value={localData.translations?.ru?.description || ''}
                  onChange={(e) => handleChange({
                    ...localData,
                    translations: {
                      ...localData.translations,
                      ru: { ...(localData.translations?.ru || {}), description: e.target.value }
                    }
                  })}
                  minRows={3}
                  autosize
                />
              </Stack>
            </Tabs.Panel>

            <Tabs.Panel value="en" pt="md">
              <Stack gap="md">
                <TextInput
                  label="Name"
                  value={localData.translations?.en?.name || ''}
                  onChange={(e) => handleChange({
                    ...localData,
                    translations: {
                      ...localData.translations,
                      en: { ...(localData.translations?.en || {}), name: e.target.value }
                    }
                  })}
                />
                <Textarea
                  label="Description"
                  value={localData.translations?.en?.description || ''}
                  onChange={(e) => handleChange({
                    ...localData,
                    translations: {
                      ...localData.translations,
                      en: { ...(localData.translations?.en || {}), description: e.target.value }
                    }
                  })}
                  minRows={3}
                  autosize
                />
              </Stack>
            </Tabs.Panel>
          </Tabs>
        </Paper>

        <Paper
          p="xl"
          mt="xl"
          style={{
            backgroundColor: '#111114',
            border: '1px solid #27272A',
            borderRadius: '12px',
          }}
        >
          <Title order={3} c="#10B981" mb="lg">
            Готовые вопросы
          </Title>

          <Tabs defaultValue="ru">
            <Tabs.List>
              <Tabs.Tab value="ru">Русский</Tabs.Tab>
              <Tabs.Tab value="en">English</Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel value="ru" pt="md">
              <Stack gap="md">
                {(localData.questions?.ru || []).map((question, index) => (
                  <Group key={index} align="flex-start">
                    <Textarea
                      style={{ flex: 1 }}
                      value={question}
                      onChange={(e) => {
                        const newQuestions = [...(localData.questions?.ru || [])];
                        newQuestions[index] = e.target.value;
                        handleChange({
                          ...localData,
                          questions: {
                            ...localData.questions,
                            ru: newQuestions,
                          },
                        });
                      }}
                      placeholder="Введите вопрос"
                      minRows={2}
                      autosize
                    />
                    <ActionIcon
                      color="red"
                      variant="subtle"
                      onClick={() => {
                        const newQuestions = (localData.questions?.ru || []).filter((_, i) => i !== index);
                        handleChange({
                          ...localData,
                          questions: {
                            ...localData.questions,
                            ru: newQuestions,
                          },
                        });
                      }}
                      style={{ marginTop: '8px' }}
                    >
                      <IconTrash size={18} />
                    </ActionIcon>
                  </Group>
                ))}
                <Button
                  leftSection={<IconPlus size={16} />}
                  variant="light"
                  color="emerald"
                  onClick={() => {
                    const newQuestions = [...(localData.questions?.ru || []), ''];
                    handleChange({
                      ...localData,
                      questions: {
                        ...localData.questions,
                        ru: newQuestions,
                      },
                    });
                  }}
                >
                  Добавить вопрос
                </Button>
              </Stack>
            </Tabs.Panel>

            <Tabs.Panel value="en" pt="md">
              <Stack gap="md">
                {(localData.questions?.en || []).map((question, index) => (
                  <Group key={index} align="flex-start">
                    <Textarea
                      style={{ flex: 1 }}
                      value={question}
                      onChange={(e) => {
                        const newQuestions = [...(localData.questions?.en || [])];
                        newQuestions[index] = e.target.value;
                        handleChange({
                          ...localData,
                          questions: {
                            ...localData.questions,
                            en: newQuestions,
                          },
                        });
                      }}
                      placeholder="Enter question"
                      minRows={2}
                      autosize
                    />
                    <ActionIcon
                      color="red"
                      variant="subtle"
                      onClick={() => {
                        const newQuestions = (localData.questions?.en || []).filter((_, i) => i !== index);
                        handleChange({
                          ...localData,
                          questions: {
                            ...localData.questions,
                            en: newQuestions,
                          },
                        });
                      }}
                      style={{ marginTop: '8px' }}
                    >
                      <IconTrash size={18} />
                    </ActionIcon>
                  </Group>
                ))}
                <Button
                  leftSection={<IconPlus size={16} />}
                  variant="light"
                  color="emerald"
                  onClick={() => {
                    const newQuestions = [...(localData.questions?.en || []), ''];
                    handleChange({
                      ...localData,
                      questions: {
                        ...localData.questions,
                        en: newQuestions,
                      },
                    });
                  }}
                >
                  Add Question
                </Button>
              </Stack>
            </Tabs.Panel>
          </Tabs>
        </Paper>
      </Box>
    </ScrollArea>
  );
}
