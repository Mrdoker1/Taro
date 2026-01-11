import { createTheme } from '@mantine/core';

export const theme = createTheme({
  primaryColor: 'gold',
  colors: {
    gold: [
      '#FFF9E6',
      '#FFF3CC',
      '#FFECB3',
      '#FFE599',
      '#FFDE80',
      '#E8D28C', // Main gold color
      '#D4BE7A',
      '#C0AA68',
      '#AC9656',
      '#988244',
    ],
    dark: [
      '#C1C2C5',
      '#A6A7AB',
      '#909296',
      '#5C5F66',
      '#373A40',
      '#2C2E33',
      '#25262B',
      '#1A1B1E',
      '#1A1625', // Sidebar
      '#0E0B1D', // Background
    ],
  },
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, sans-serif',
  defaultRadius: 'md',
  components: {
    Button: {
      defaultProps: {
        radius: 'md',
      },
      styles: (theme, params) => ({
        root: {
          // Темный текст для золотых кнопок (filled variant)
          ...(params.variant === 'filled' && params.color === 'gold' && {
            color: 'var(--mantine-color-dark-9)',
            '&:hover': {
              color: 'var(--mantine-color-dark-9)',
            },
          }),
        },
      }),
    },
    TextInput: {
      defaultProps: {
        radius: 'md',
      },
    },
    Textarea: {
      defaultProps: {
        radius: 'md',
      },
    },
    Select: {
      defaultProps: {
        radius: 'md',
      },
    },
    NumberInput: {
      defaultProps: {
        radius: 'md',
      },
    },
    Paper: {
      defaultProps: {
        radius: 'md',
      },
    },
    Modal: {
      defaultProps: {
        radius: 'md',
      },
    },
  },
});
