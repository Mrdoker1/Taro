import { useState, useEffect } from 'react';
import { Box, Title, Text, Paper, Stack, TextInput, Textarea, Switch, Tabs, ScrollArea, Button, ActionIcon, Group, Accordion, NumberInput, Tooltip } from '@mantine/core';
import { IconPlus, IconTrash, IconAlertTriangle } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import { decksApi } from '../api/client';
import { ImagePreviewInput, clearImageFetchQueue } from './ImagePreviewInput';

const MAX_IMAGE_SIZE_KEY = 'deck-max-image-size';

export function DecksEditor({ selectedDeck, deckData, onDeckChange }) {
  const [localData, setLocalData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [maxImageSize, setMaxImageSize] = useState(() => {
    // Загружаем из localStorage при инициализации
    try {
      const stored = localStorage.getItem(MAX_IMAGE_SIZE_KEY);
      return stored ? parseInt(stored, 10) : 500;
    } catch {
      return 500;
    }
  }); // KB
  const [cardImageSizes, setCardImageSizes] = useState({}); // Хранение размеров изображений карт

  useEffect(() => {
    // Очищаем очередь запросов и размеры карт при смене колоды
    clearImageFetchQueue();
    setCardImageSizes({});
    
    if (selectedDeck && selectedDeck !== 'new') {
      loadDeck(selectedDeck);
    } else if (selectedDeck === 'new') {
      const newData = {
        key: '',
        available: true,
        coverImageUrl: '',
        translations: {
          ru: { name: '', description: '' },
          en: { name: '', description: '' },
        },
        cards: [],
      };
      setLocalData(newData);
      onDeckChange(newData);
    } else {
      setLocalData(null);
      onDeckChange(null);
    }
    
    // Очистка при размонтировании компонента
    return () => {
      clearImageFetchQueue();
    };
  }, [selectedDeck]);

  useEffect(() => {
    if (deckData) {
      setLocalData(deckData);
    }
  }, [deckData]);

  const loadDeck = async (key) => {
    try {
      setLoading(true);
      const data = await decksApi.getDeckRaw(key);
      console.log('Deck data:', data);
      setLocalData(data);
      onDeckChange(data);
    } catch (error) {
      console.error('Error loading deck:', error);
      notifications.show({
        title: 'Ошибка',
        message: 'Не удалось загрузить колоду',
        color: 'red',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (newData) => {
    setLocalData(newData);
    onDeckChange(newData);
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
          Выберите колоду для редактирования или создайте новую
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
          <Title order={3} c="#8B5CF6" mb="lg">
            Основная информация
          </Title>

          <Stack gap="md">
            <TextInput
              label="Key (идентификатор)"
              value={localData.key || ''}
              onChange={(e) => handleChange({ ...localData, key: e.target.value })}
              placeholder="rider"
              required
              disabled={selectedDeck !== 'new'}
            />

            <ImagePreviewInput
              label="URL обложки"
              value={localData.coverImageUrl || ''}
              onChange={(e) => handleChange({ ...localData, coverImageUrl: e.target.value })}
              placeholder="https://..."
            />

            <Switch
              label="Опубликована"
              checked={localData.available}
              onChange={(e) => handleChange({ ...localData, available: e.currentTarget.checked })}
            />

            <NumberInput
              label="Максимальный размер изображения карты (KB)"
              description="Показывать предупреждение, если размер изображения карты превышает это значение"
              value={maxImageSize}
              onChange={(value) => {
                const newValue = value || 500;
                setMaxImageSize(newValue);
                // Сохраняем в localStorage
                try {
                  localStorage.setItem(MAX_IMAGE_SIZE_KEY, newValue.toString());
                } catch (error) {
                  console.error('Error saving max image size:', error);
                }
              }}
              min={50}
              max={5000}
              step={50}
              suffix=" KB"
              styles={{
                input: {
                  backgroundColor: '#18181B',
                  borderColor: '#27272A',
                  color: '#FFFFFF',
                },
                description: {
                  color: '#71717A',
                  fontSize: '12px',
                },
              }}
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
          <Title order={3} c="#8B5CF6" mb="lg">
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
          style={{
            backgroundColor: '#111114',
            border: '1px solid #27272A',
            borderRadius: '12px',
          }}
        >
          <Group justify="space-between" mb="lg">
            <Title order={3} c="#8B5CF6">
              Карты ({localData.cards?.length || 0})
            </Title>
            <Button
              leftSection={<IconPlus size={16} />}
              onClick={() => {
                const newCard = {
                  id: `card-${Date.now()}`,
                  imageUrl: '',
                  translations: {
                    ru: {
                      name: '',
                      meaning: {
                        upright: '',
                        reversed: '',
                      },
                    },
                    en: {
                      name: '',
                      meaning: {
                        upright: '',
                        reversed: '',
                      },
                    },
                  },
                };
                handleChange({
                  ...localData,
                  cards: [...(localData.cards || []), newCard],
                });
              }}
              variant="light"
              color="violet"
              size="sm"
            >
              Добавить карту
            </Button>
          </Group>

          <Accordion variant="separated" chevronPosition="left">
            {(localData.cards || []).map((card, cardIndex) => (
              <Accordion.Item key={card.id || cardIndex} value={`card-${cardIndex}`}>
                <Accordion.Control
                  icon={
                    <ActionIcon
                      color="red"
                      variant="subtle"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm('Удалить эту карту?')) {
                          const newCards = localData.cards.filter((_, i) => i !== cardIndex);
                          handleChange({
                            ...localData,
                            cards: newCards,
                          });
                        }
                      }}
                    >
                      <IconTrash size={16} />
                    </ActionIcon>
                  }
                >
                  <Group gap="xs" style={{ flex: 1 }}>
                    <Text fw={500}>
                      {card.translations?.ru?.name || card.translations?.en?.name || `Карта ${cardIndex + 1}`}
                    </Text>
                    {cardImageSizes[card.id] && cardImageSizes[card.id] > maxImageSize * 1024 && (
                      <Tooltip 
                        label={`Размер изображения превышает ${maxImageSize} KB`}
                        position="top"
                        withArrow
                        styles={{
                          tooltip: {
                            backgroundColor: '#EF4444',
                            color: '#FFFFFF',
                          },
                        }}
                      >
                        <Box style={{ display: 'flex', alignItems: 'center' }}>
                          <IconAlertTriangle size={18} color="#EF4444" />
                        </Box>
                      </Tooltip>
                    )}
                  </Group>
                </Accordion.Control>
                <Accordion.Panel>
                  <Stack gap="md">
                    <TextInput
                      label="ID карты"
                      value={card.id || ''}
                      onChange={(e) => {
                        const newCards = [...localData.cards];
                        newCards[cardIndex] = { ...card, id: e.target.value };
                        handleChange({ ...localData, cards: newCards });
                      }}
                      placeholder="the-fool"
                    />

                    <ImagePreviewInput
                      label="URL изображения"
                      value={card.imageUrl || ''}
                      onChange={(e) => {
                        const newCards = [...localData.cards];
                        newCards[cardIndex] = { ...card, imageUrl: e.target.value };
                        handleChange({ ...localData, cards: newCards });
                      }}
                      placeholder="https://..."
                      maxSizeKB={maxImageSize}
                      onSizeChange={(size) => {
                        setCardImageSizes(prev => ({
                          ...prev,
                          [card.id]: size
                        }));
                      }}
                    />

                    <Tabs defaultValue="ru">
                      <Tabs.List>
                        <Tabs.Tab value="ru">Русский</Tabs.Tab>
                        <Tabs.Tab value="en">English</Tabs.Tab>
                      </Tabs.List>

                      <Tabs.Panel value="ru" pt="md">
                        <Stack gap="md">
                          <TextInput
                            label="Название карты"
                            value={card.translations?.ru?.name || ''}
                            onChange={(e) => {
                              const newCards = [...localData.cards];
                              newCards[cardIndex] = {
                                ...card,
                                translations: {
                                  ...card.translations,
                                  ru: {
                                    ...(card.translations?.ru || {}),
                                    name: e.target.value,
                                    meaning: card.translations?.ru?.meaning || { upright: '', reversed: '' },
                                  },
                                },
                              };
                              handleChange({ ...localData, cards: newCards });
                            }}
                            placeholder="Шут"
                          />

                          <Textarea
                            label="Значение (прямое)"
                            value={card.translations?.ru?.meaning?.upright || ''}
                            onChange={(e) => {
                              const newCards = [...localData.cards];
                              newCards[cardIndex] = {
                                ...card,
                                translations: {
                                  ...card.translations,
                                  ru: {
                                    ...(card.translations?.ru || {}),
                                    meaning: {
                                      ...(card.translations?.ru?.meaning || {}),
                                      upright: e.target.value,
                                    },
                                  },
                                },
                              };
                              handleChange({ ...localData, cards: newCards });
                            }}
                            minRows={3}
                            autosize
                            placeholder="Описание прямого значения..."
                          />

                          <Textarea
                            label="Значение (перевернутое)"
                            value={card.translations?.ru?.meaning?.reversed || ''}
                            onChange={(e) => {
                              const newCards = [...localData.cards];
                              newCards[cardIndex] = {
                                ...card,
                                translations: {
                                  ...card.translations,
                                  ru: {
                                    ...(card.translations?.ru || {}),
                                    meaning: {
                                      ...(card.translations?.ru?.meaning || {}),
                                      reversed: e.target.value,
                                    },
                                  },
                                },
                              };
                              handleChange({ ...localData, cards: newCards });
                            }}
                            minRows={3}
                            autosize
                            placeholder="Описание перевернутого значения..."
                          />
                        </Stack>
                      </Tabs.Panel>

                      <Tabs.Panel value="en" pt="md">
                        <Stack gap="md">
                          <TextInput
                            label="Card Name"
                            value={card.translations?.en?.name || ''}
                            onChange={(e) => {
                              const newCards = [...localData.cards];
                              newCards[cardIndex] = {
                                ...card,
                                translations: {
                                  ...card.translations,
                                  en: {
                                    ...(card.translations?.en || {}),
                                    name: e.target.value,
                                    meaning: card.translations?.en?.meaning || { upright: '', reversed: '' },
                                  },
                                },
                              };
                              handleChange({ ...localData, cards: newCards });
                            }}
                            placeholder="The Fool"
                          />

                          <Textarea
                            label="Meaning (Upright)"
                            value={card.translations?.en?.meaning?.upright || ''}
                            onChange={(e) => {
                              const newCards = [...localData.cards];
                              newCards[cardIndex] = {
                                ...card,
                                translations: {
                                  ...card.translations,
                                  en: {
                                    ...(card.translations?.en || {}),
                                    meaning: {
                                      ...(card.translations?.en?.meaning || {}),
                                      upright: e.target.value,
                                    },
                                  },
                                },
                              };
                              handleChange({ ...localData, cards: newCards });
                            }}
                            minRows={3}
                            autosize
                            placeholder="Upright meaning description..."
                          />

                          <Textarea
                            label="Meaning (Reversed)"
                            value={card.translations?.en?.meaning?.reversed || ''}
                            onChange={(e) => {
                              const newCards = [...localData.cards];
                              newCards[cardIndex] = {
                                ...card,
                                translations: {
                                  ...card.translations,
                                  en: {
                                    ...(card.translations?.en || {}),
                                    meaning: {
                                      ...(card.translations?.en?.meaning || {}),
                                      reversed: e.target.value,
                                    },
                                  },
                                },
                              };
                              handleChange({ ...localData, cards: newCards });
                            }}
                            minRows={3}
                            autosize
                            placeholder="Reversed meaning description..."
                          />
                        </Stack>
                      </Tabs.Panel>
                    </Tabs>
                  </Stack>
                </Accordion.Panel>
              </Accordion.Item>
            ))}
          </Accordion>

          {(!localData.cards || localData.cards.length === 0) && (
            <Text c="#71717A" size="sm" ta="center" mt="md">
              Нет карт. Нажмите "Добавить карту" чтобы создать первую карту.
            </Text>
          )}
        </Paper>
      </Box>
    </ScrollArea>
  );
}
