import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';
import { setupServer } from 'msw/node';
import { handlers } from './mocks/handlers';

// Setup MSW
export const server = setupServer(...handlers);

// Mock timers
vi.useFakeTimers();

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));

afterEach(() => {
  server.resetHandlers();
  cleanup();
  // Reset timers after each test
  vi.useRealTimers();
});

afterAll(() => server.close());