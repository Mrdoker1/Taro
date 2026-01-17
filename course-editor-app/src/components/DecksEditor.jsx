import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { Box, Title, Text, Paper, Stack, TextInput, Textarea, Switch, Tabs, ScrollArea, Button, ActionIcon, Group, Accordion, NumberInput, Tooltip, Progress, LoadingOverlay, Modal, Image } from '@mantine/core';
import { IconPlus, IconTrash, IconAlertTriangle, IconRefresh, IconEye } from '@tabler/icons-react';
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
  const [cardImageSizes, setCardImageSizes] = useState(() => {
    // Загружаем размеры из localStorage при инициализации
    try {
      const stored = localStorage.getItem(`deck-card-sizes-${selectedDeck}`);
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  });
  const [isCheckingSizes, setIsCheckingSizes] = useState(false);
  const [checkProgress, setCheckProgress] = useState({ current: 0, total: 0 });
  const [previewImage, setPreviewImage] = useState(null);
  
  // Функция проверки размеров всех карт
  const checkAllCardSizes = async () => {
    if (!localData?.cards || localData.cards.length === 0) return;
    
    setIsCheckingSizes(true);
    setCheckProgress({ current: 0, total: localData.cards.length });
    
    const sizes = {};
    
    for (let i = 0; i < localData.cards.length; i++) {
      const card = localData.cards[i];
      if (!card.imageUrl) {
        setCheckProgress({ current: i + 1, total: localData.cards.length });
        continue;
      }
      
      try {
        const response = await fetch(card.imageUrl, { method: 'HEAD' });
        const contentLength = response.headers.get('content-length');
        if (contentLength) {
          sizes[card.id] = parseInt(contentLength, 10);
        }
      } catch (error) {
        console.error(`Error checking size for card ${card.id}:`, error);
      }
      
      setCheckProgress({ current: i + 1, total: localData.cards.length });
      
      // Небольшая задержка между запросами
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    setCardImageSizes(sizes);
    
    // Сохраняем в localStorage
    try {
      localStorage.setItem(`deck-card-sizes-${selectedDeck}`, JSON.stringify(sizes));
    } catch (error) {
      console.error('Error saving sizes to localStorage:', error);
    }
    
    setIsCheckingSizes(false);
    setCheckProgress({ current: 0, total: 0 });
    
    notifications.show({
      title: 'Готово',
      message: `Проверено ${localData.cards.length} карт`,
      color: 'green',
    });
  };
  
  // Мемоизируем проверку предупреждений
  const cardWarnings = useMemo(() => {
    const warnings = {};
    Object.keys(cardImageSizes).forEach(cardId => {
      warnings[cardId] = cardImageSizes[cardId] > maxImageSize * 1024;
    });
    return warnings;
  }, [cardImageSizes, maxImageSize]);

  useEffect(() => {
    // Очищаем очередь запросов при смене колоды
    clearImageFetchQueue();
    
    // Загружаем размеры карт из localStorage для новой колоды
    try {
      const stored = localStorage.getItem(`deck-card-sizes-${selectedDeck}`);
      setCardImageSizes(stored ? JSON.parse(stored) : {});
    } catch {
      setCardImageSizes({});
    }
    
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
    <Box style={{ position: 'relative' }}>
      {/* Прогресс-бар поверх всего */}
      {isCheckingSizes && (
        <Box
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 1001,
            backgroundColor: '#18181B',
            borderBottom: '1px solid #27272A',
            padding: '16px',
          }}
        >
          <Group gap="md" align="center">
            <Text size="sm" c="#A1A1AA" style={{ minWidth: '150px' }}>
              Проверка размеров: {checkProgress.current} / {checkProgress.total}
            </Text>
            <Progress 
              value={(checkProgress.current / checkProgress.total) * 100} 
              color="violet"
              size="md"
              animated
              style={{ flex: 1 }}
            />
          </Group>
        </Box>
      )}
      
      <ScrollArea h="calc(100vh - 64px)">
        <Box p="xl" style={{ position: 'relative' }}>
          <LoadingOverlay 
            visible={isCheckingSizes} 
            overlayProps={{ blur: 2 }}
            loaderProps={{ display: 'none' }}
          />
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

            <Box>
              <Group gap="xs" align="flex-end">
                <NumberInput
                  label="Максимальный размер изображения карты (KB)"
                  description="Показывать предупреждение, если размер изображения карты превышает это значение"
                  value={maxImageSize}
                  onChange={(value) => {
                    const newValue = value || 500;
                    setMaxImageSize(newValue);
                  }}
                  onBlur={() => {
                    // Сохраняем в localStorage только при потере фокуса
                    try {
                      localStorage.setItem(MAX_IMAGE_SIZE_KEY, maxImageSize.toString());
                    } catch (error) {
                      console.error('Error saving max image size:', error);
                    }
                  }}
                  min={50}
                  max={5000}
                  step={50}
                  suffix=" KB"
                  style={{ flex: 1 }}
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
                <Button
                  leftSection={<IconRefresh size={16} />}
                  onClick={checkAllCardSizes}
                  loading={isCheckingSizes}
                  variant="light"
                  color="violet"
                  styles={{
                    root: {
                      flexShrink: 0,
                    },
                  }}
                >
                  Проверить размеры
                </Button>
              </Group>
            </Box>
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
                    <Box
                      component="div"
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
                      style={{
                        cursor: 'pointer',
                        color: '#EF4444',
                        display: 'flex',
                        alignItems: 'center',
                        padding: '4px',
                        borderRadius: '4px',
                        transition: 'background-color 0.2s',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }}
                    >
                      <IconTrash size={16} />
                    </Box>
                  }
                >
                  <Group gap="xs" style={{ flex: 1 }}>
                    <Text fw={500}>
                      {card.translations?.ru?.name || card.translations?.en?.name || `Карта ${cardIndex + 1}`}
                    </Text>
                    {cardWarnings[card.id] && (
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

                    <Box>
                      <TextInput
                        label="URL изображения"
                        value={card.imageUrl || ''}
                        onChange={(e) => {
                          const newCards = [...localData.cards];
                          newCards[cardIndex] = { ...card, imageUrl: e.target.value };
                          handleChange({ ...localData, cards: newCards });
                        }}
                        placeholder="https://..."
                        rightSection={
                          card.imageUrl && (
                            <ActionIcon
                              variant="subtle"
                              color="violet"
                              onClick={() => setPreviewImage(card.imageUrl)}
                            >
                              <IconEye size={18} />
                            </ActionIcon>
                          )
                        }
                      />
                      
                      {/* Превью и размер после проверки */}
                      {cardImageSizes[card.id] && card.imageUrl && (
                        <Box
                          mt="md"
                          p="md"
                          style={{
                            backgroundColor: '#18181B',
                            border: '1px solid #27272A',
                            borderRadius: '8px',
                          }}
                        >
                          <Group gap="md" align="flex-start">
                            <Box
                              style={{
                                width: '120px',
                                height: '180px',
                                borderRadius: '8px',
                                overflow: 'hidden',
                                backgroundColor: '#09090B',
                                border: '1px solid #27272A',
                                flexShrink: 0,
                              }}
                            >
                              <img
                                src={card.imageUrl}
                                alt={card.translations?.ru?.name || 'Card'}
                                style={{
                                  width: '100%',
                                  height: '100%',
                                  objectFit: 'cover',
                                }}
                                onError={(e) => {
                                  e.target.style.display = 'none';
                                }}
                              />
                            </Box>
                            <Stack gap="xs" style={{ flex: 1 }}>
                              <Text size="sm" fw={500} c="#A1A1AA">
                                Информация об изображении
                              </Text>
                              <Group gap="xs">
                                <Text size="sm" c="#71717A">
                                  Размер:
                                </Text>
                                <Text
                                  size="sm"
                                  fw={500}
                                  c={cardImageSizes[card.id] > maxImageSize * 1024 ? '#EF4444' : '#10B981'}
                                >
                                  {(cardImageSizes[card.id] / 1024).toFixed(2)} KB
                                </Text>
                              </Group>
                              {cardImageSizes[card.id] > maxImageSize * 1024 && (
                                <Group gap="xs" align="flex-start">
                                  <IconAlertTriangle size={16} color="#EF4444" style={{ marginTop: '2px' }} />
                                  <Text size="xs" c="#EF4444">
                                    Превышает лимит {maxImageSize} KB
                                  </Text>
                                </Group>
                              )}
                            </Stack>
                          </Group>
                        </Box>
                      )}
                    </Box>

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
    
    {/* Модальное окно для превью изображения */}
    <Modal
      opened={!!previewImage}
      onClose={() => setPreviewImage(null)}
      title="Превью изображения"
      size="auto"
      centered
      styles={{
        title: {
          color: '#8B5CF6',
          fontWeight: 600,
        },
        content: {
          backgroundColor: '#111114',
        },
        header: {
          backgroundColor: '#111114',
          borderBottom: '1px solid #27272A',
        },
        body: {
          padding: '20px',
        },
      }}
    >
      <Box
        style={{
          maxWidth: '90vw',
          maxHeight: '80vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Image
          src={previewImage}
          alt="Preview"
          fit="contain"
          style={{
            maxWidth: '100%',
            maxHeight: '80vh',
          }}
        />
      </Box>
    </Modal>
    </Box>
  );
}
