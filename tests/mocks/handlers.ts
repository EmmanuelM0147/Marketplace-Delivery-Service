import { http, HttpResponse } from 'msw';

export const handlers = [
  // Users handlers
  http.get('*/api/admin/users', () => {
    return HttpResponse.json({
      users: [
        {
          id: '1',
          full_name: 'Test User',
          email: 'test@example.com',
          role: 'user',
          created_at: new Date().toISOString(),
        },
      ],
      total: 1,
      page: 1,
      totalPages: 1,
    });
  }),

  http.patch('*/api/admin/users', () => {
    return HttpResponse.json({
      user: {
        id: '1',
        email: 'test@example.com',
        role: 'admin',
      },
    });
  }),

  // Logs handlers
  http.get('*/api/admin/logs', () => {
    return HttpResponse.json({
      logs: [
        {
          id: '1',
          action_type: 'user_update',
          target_type: 'profiles',
          target_id: '1',
          admin: {
            email: 'admin@example.com',
          },
          created_at: new Date().toISOString(),
          changes: { role: 'admin' },
        },
      ],
      total: 1,
      page: 1,
      totalPages: 1,
    });
  }),

  http.post('*/api/admin/logs', () => {
    return new HttpResponse(
      new Blob(['test'], { type: 'text/csv' }),
      {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': 'attachment; filename="system-logs.csv"',
        },
      }
    );
  }),
];