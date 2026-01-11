import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3001,
    proxy: {
      '/course-editor/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
      '/course-editor/login': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: '../dist/course-editor/public',
    emptyOutDir: true,
  },
});
