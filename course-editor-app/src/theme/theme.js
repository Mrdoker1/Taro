import { createTheme } from '@mantine/core';

export const theme = createTheme({
  primaryColor: 'emerald',
  colors: {
    emerald: [
      '#D1FAE5',
      '#A7F3D0',
      '#6EE7B7',
      '#34D399',
      '#10B981', // Primary accent
      '#059669',
      '#047857',
      '#065F46',
      '#064E3B',
      '#022C22',
    ],
    dark: [
      '#FFFFFF', // 0 - Primary text
      '#A1A1AA', // 1 - Secondary text
      '#71717A', // 2 - Muted text
      '#52525B', // 3 - Disabled
      '#3F3F46', // 4 - Border
      '#27272A', // 5 - Input border
      '#18181B', // 6 - Surface (cards)
      '#111114', // 7 - Input background
      '#0E0E12', // 8 - Main background
      '#09090B', // 9 - Deepest
    ],
  },
  fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  defaultRadius: '8px',
  spacing: {
    xs: '8px',
    sm: '12px',
    md: '16px',
    lg: '24px',
    xl: '32px',
  },
  components: {
    Button: {
      defaultProps: {
        radius: '8px',
      },
      styles: (theme, params) => ({
        root: {
          fontWeight: 600,
          transition: 'all 0.2s ease',
        },
      }),
    },
    InputWrapper: {
      styles: (theme) => ({
        label: {
          fontSize: '11px',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
          color: '#A1A1AA',
          marginBottom: '8px',
        },
      }),
    },
    Input: {
      styles: (theme) => ({
        input: {
          backgroundColor: '#111114',
          border: '1px solid #27272A',
          color: '#FFFFFF',
          fontSize: '14px',
          padding: '12px 16px',
          '&:focus': {
            borderColor: '#10B981',
          },
          '&::placeholder': {
            color: '#71717A',
          },
        },
      }),
    },
    TextInput: {
      defaultProps: {
        radius: '8px',
      },
    },
    Textarea: {
      defaultProps: {
        radius: '8px',
      },
    },
    Select: {
      defaultProps: {
        radius: '8px',
      },
    },
    NumberInput: {
      defaultProps: {
        radius: '8px',
      },
    },
    PasswordInput: {
      defaultProps: {
        radius: '8px',
      },
    },
    Paper: {
      defaultProps: {
        radius: '12px',
      },
      styles: (theme) => ({
        root: {
          backgroundColor: '#18181B',
          border: '1px solid #27272A',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        },
      }),
    },
    Modal: {
      defaultProps: {
        radius: '12px',
      },
    },
    Tabs: {
      styles: (theme) => ({
        tab: {
          fontWeight: 600,
          fontSize: '14px',
          padding: '12px 24px',
          '&[data-active]': {
            borderBottomColor: '#10B981',
            borderBottomWidth: '2px',
            color: '#10B981',
          },
        },
      }),
    },
    Switch: {
      styles: (theme) => ({
        track: {
          cursor: 'pointer',
          backgroundColor: '#27272A',
          border: 'none',
        },
      }),
    },
  },
});
