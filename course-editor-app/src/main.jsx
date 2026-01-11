import React from 'react';
import ReactDOM from 'react-dom/client';
import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import App from './App';
import { theme } from './theme/theme';

import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';

// Global styles
const globalStyles = `
  html, body {
    margin: 0;
    padding: 0;
    background-color: #0E0E12 !important;
    height: 100%;
    width: 100%;
  }
  
  #root {
    height: 100%;
    width: 100%;
  }
`;

const styleSheet = document.createElement('style');
styleSheet.textContent = globalStyles;
document.head.appendChild(styleSheet);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <MantineProvider theme={theme} defaultColorScheme="dark">
      <Notifications position="top-right" />
      <App />
    </MantineProvider>
  </React.StrictMode>
);
