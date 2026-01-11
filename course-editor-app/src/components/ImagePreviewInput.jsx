import { useState } from 'react';
import { TextInput, ActionIcon, Modal, Image, Text } from '@mantine/core';
import { IconEye } from '@tabler/icons-react';

export function ImagePreviewInput({ label, value, onChange, placeholder, ...props }) {
  const [previewOpened, setPreviewOpened] = useState(false);

  return (
    <>
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

      <Modal
        opened={previewOpened}
        onClose={() => setPreviewOpened(false)}
        title="Предпросмотр изображения"
        size="lg"
        centered
      >
        {value ? (
          <Image
            src={value}
            alt="Preview"
            fit="contain"
            style={{ maxHeight: '70vh' }}
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'block';
            }}
          />
        ) : (
          <Text c="dimmed" ta="center">
            URL изображения не указан
          </Text>
        )}
        <Text
          c="red"
          size="sm"
          ta="center"
          mt="md"
          style={{ display: 'none' }}
        >
          Не удалось загрузить изображение
        </Text>
      </Modal>
    </>
  );
}
