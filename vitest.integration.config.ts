import { defineConfig } from 'vitest/config';
import { resolve } from 'path';

export default defineConfig({
  test: {
    environment: 'node',
    setupFiles: ['./tests/setup.integration.ts'],
    include: ['**/*.integration.test.{ts,tsx}'],
    testTimeout: 30000,
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './'),
    },
  },
});