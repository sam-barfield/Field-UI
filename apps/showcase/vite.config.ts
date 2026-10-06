import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// The showcase compiles the packages from source so edits show up instantly.
export default defineConfig({
  base: './',
  plugins: [react()],
  resolve: {
    alias: {
      '@sam.barfield/field-tokens': path.resolve(__dirname, '../../packages/tokens/src'),
      '@sam.barfield/field-react': path.resolve(__dirname, '../../packages/react/src'),
    },
  },
  build: {
    // The docs bundle every live example eagerly (~165 kB gzipped); that's fine for a docs site.
    chunkSizeWarningLimit: 800,
    rollupOptions: {
      onwarn(warning, warn) {
        // Component modules start with 'use client' for Next.js; Vite can ignore it.
        if (warning.code === 'MODULE_LEVEL_DIRECTIVE') return;
        warn(warning);
      },
    },
  },
  server: {
    port: 5173,
  },
});
