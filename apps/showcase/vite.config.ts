import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@field/tokens': path.resolve(__dirname, '../../packages/tokens/src'),
      '@field/react': path.resolve(__dirname, '../../packages/react/src'),
    },
  },
  server: {
    port: 5173,
  },
});
