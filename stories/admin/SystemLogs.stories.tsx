import type { Meta, StoryObj } from '@storybook/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SystemLogs } from '@/components/admin/system-logs';
import { handlers } from '@/tests/mocks/handlers';
import { initialize, mswLoader } from 'msw-storybook-addon';

// Initialize MSW
initialize();

const queryClient = new QueryClient();

const meta = {
  title: 'Admin/SystemLogs',
  component: SystemLogs,
  decorators: [
    (Story) => (
      <QueryClientProvider client={queryClient}>
        <Story />
      </QueryClientProvider>
    ),
  ],
  parameters: {
    layout: 'padded',
    msw: {
      handlers,
    },
  },
  loaders: [mswLoader],
} satisfies Meta<typeof SystemLogs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Loading: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get('*/api/admin/logs', () => {
          return HttpResponse.json(
            { error: 'Loading...' },
            { status: 200 }
          );
        }),
      ],
    },
  },
};

export const Error: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get('*/api/admin/logs', () => {
          return HttpResponse.json(
            { error: 'Failed to fetch logs' },
            { status: 500 }
          );
        }),
      ],
    },
  },
};

export const Empty: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get('*/api/admin/logs', () => {
          return HttpResponse.json({
            logs: [],
            total: 0,
            page: 1,
            totalPages: 0,
          });
        }),
      ],
    },
  },
};