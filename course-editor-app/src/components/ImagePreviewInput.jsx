import { useState, useEffect, useRef } from 'react';
import { TextInput, ActionIcon, Modal, Image, Text, Box, Group, Stack, Alert } from '@mantine/core';
import { IconEye, IconAlertTriangle } from '@tabler/icons-react';

// Глобальный кэш для размеров изображений
const imageSizeCache = new Map();
// Очередь запросов
let fetchQueue = [];
let isProcessingQueue = false;

const processFetchQueue = async () => {
  if (isProcessingQueue || fetchQueue.length === 0) return;
  
  isProcessingQueue = true;
  
  while (fetchQueue.length > 0) {
    const item = fetchQueue.shift();
    if (!item) continue;
    
    try {
      const response = await fetch(item.url, { method: 'HEAD' }); // Используем HEAD вместо GET
      const contentLength = response.headers.get('content-length');
      if (contentLength) {
        const sizeInBytes = parseInt(contentLength, 10);
        imageSizeCache.set(item.url, sizeInBytes);
        item.resolve(sizeInBytes);
      } else {
        item.resolve(null);
      }
    } catch (error) {
      item.resolve(null);
    }
    
    // Небольшая задержка между запросами
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  isProcessingQueue = false;
};

const fetchImageSize = (url) => {
  // Проверяем кэш
  if (imageSizeCache.has(url)) {
    return Promise.resolve(imageSizeCache.get(url));
  }
  
  // Добавляем в очередь
  return new Promise((resolve) => {
    fetchQueue.push({ url, resolve });
    processFetchQueue();
  });
};

export function ImagePreviewInput({ label, value, onChange, placeholder, maxSizeKB, onSizeChange, ...props }) {
  const [previewOpened, setPreviewOpened] = useState(false);
  const [imageDimensions, setImageDimensions] = useState(null);
  const [imageSize, setImageSize] = useState(null);
  const [imageError, setImageError] = useState(false);
  const [isLoadingSize, setIsLoadingSize] = useState(false);
  const abortControllerRef = useRef(null);

  useEffect(() => {
    if (!value) {
      setImageDimensions(null);
      setImageSize(null);
      setImageError(false);
      setIsLoadingSize(false);
      return;
    }

    // Отменяем предыдущий запрос
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    const img = new window.Image();
    img.onload = () => {
      setImageDimensions({ width: img.naturalWidth, height: img.naturalHeight });
      setImageError(false);
    };
    img.onerror = () => {
      setImageDimensions(null);
      setImageSize(null);
      setImageError(true);
    };
    img.src = value;

    // Получаем размер файла через очередь
    setIsLoadingSize(true);
    fetchImageSize(value)
      .then(size => {
        if (!abortControllerRef.current?.signal.aborted) {
          setImageSize(size);
          setIsLoadingSize(false);
          if (onSizeChange) onSizeChange(size);
        }
      });

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [value, onSizeChange]);

  const formatFileSize = (bytes) => {
    if (!bytes) return null;
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <>
      <Stack gap="xs">
        <TextInput
          label={label}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          rightSection={
            value && (
              <ActionIcon
                variant="subtle"
                color="gray"
                onClick={() => setPreviewOpened(true)}
                style={{ cursor: 'pointer' }}
              >
                <IconEye size={18} />
              </ActionIcon>
            )
          }
          {...props}
        />
        
        {value && (
          <Group gap="md" align="flex-start">
            <Box
              style={{
                width: '120px',
                height: '80px',
                borderRadius: '8px',
                overflow: 'hidden',
                border: '1px solid #27272A',
                backgroundColor: '#18181B',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
              onClick={() => setPreviewOpened(true)}
            >
              {!imageError ? (
                <img
                  src={value}
                  alt="Preview"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                  onError={() => setImageError(true)}
                />
              ) : (
                <Text c="red" size="xs" ta="center" px="xs">
                  Ошибка загрузки
                </Text>
              )}
            </Box>
            
            {(imageDimensions || imageSize) && (
              <Box>
                <Text size="xs" c="#A1A1AA" fw={600} mb={4}>
                  Информация:
                </Text>
                {imageDimensions && (
                  <Text size="xs" c="#FFFFFF" mb={2}>
                    {imageDimensions.width} × {imageDimensions.height} px
                  </Text>
                )}
                {imageSize && (
                  <Text 
                    size="xs" 
                    c={maxSizeKB && imageSize > maxSizeKB * 1024 ? "#EF4444" : "#8B5CF6"} 
                    fw={600}
                  >
                    {formatFileSize(imageSize)}
                  </Text>
                )}
              </Box>
            )}
          </Group>
        )}
        
        {maxSizeKB && imageSize && imageSize > maxSizeKB * 1024 && (
          <Alert 
            icon={<IconAlertTriangle size={16} />} 
            color="red" 
            variant="light"
            styles={{
              root: {
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
              },
              message: {
                color: '#EF4444',
              },
            }}
          >
            <Text size="xs" fw={600}>
              Предупреждение: размер изображения ({formatFileSize(imageSize)}) превышает максимальный ({maxSizeKB} KB)
            </Text>
          </Alert>
        )}
      </Stack>

      <Modal
        opened={previewOpened}
        onClose={() => setPreviewOpened(false)}
        title="Предпросмотр изображения"
        size="lg"
        centered
      >
        {value ? (
          <Stack gap="md">
            <Image
              src={value}
              alt="Preview"
              fit="contain"
              style={{ maxHeight: '70vh' }}
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
            {(imageDimensions || imageSize) && (
              <Box ta="center">
                {imageDimensions && (
                  <Text size="sm" c="#A1A1AA">
                    Размер: {imageDimensions.width} × {imageDimensions.height} px
                  </Text>
                )}
                {imageSize && (
                  <Text size="sm" c="#8B5CF6" fw={600} mt={4}>
                    Размер файла: {formatFileSize(imageSize)}
                  </Text>
                )}
              </Box>
            )}
          </Stack>
        ) : (
          <Text c="dimmed" ta="center">
            URL изображения не указан
          </Text>
        )}
        {imageError && (
          <Text c="red" size="sm" ta="center" mt="md">
            Не удалось загрузить изображение
          </Text>
        )}
      </Modal>
    </>
  );
}
