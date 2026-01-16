import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      //also update in tsconfig.json, tsconfig.app.json, jest.config.js!
      '@': '/src',
      '@layout': '/src/components/layout',
      '@sections': '/src/sections',
      '@contexts': '/src/contexts',
      '@data': '/src/data',
      '@hooks': '/src/hooks',
      '@shared': '/src/components/shared',
      '@ui': '/src/components/ui',
      '@utils': '/src/utils',
      '@assets': '/src/assets',
      '@lib': '/lib',
    },
  },
  server: {
    proxy: {
      '/api': 'http://localhost:3000',
    },
  },
});
