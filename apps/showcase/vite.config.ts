import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// The showcase compiles the packages from source so edits show up instantly.
export default defineConfig({
  base: './',
  plugins: [react()],
  resolve: {
    alias: [
      // Field's stylesheet, in the cascade layers the published package uses (see src/field-layered.css).
      { find: '@sam.barfield/field-react/styles/field.css', replacement: path.resolve(__dirname, 'src/field-layered.css') },
      { find: '@sam.barfield/field-tokens', replacement: path.resolve(__dirname, '../../packages/tokens/src') },
      { find: '@sam.barfield/field-react', replacement: path.resolve(__dirname, '../../packages/react/src') },
    ],
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
    port: Number(process.env.PORT) || 5173,
  },
});
