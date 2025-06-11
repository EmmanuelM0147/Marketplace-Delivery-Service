import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./tests/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      exclude: [
        'node_modules/',
        'tests/setup.ts',
      ],
    },
    include: ['**/*.test.{ts,tsx}'],
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './'),
    },
  },
});