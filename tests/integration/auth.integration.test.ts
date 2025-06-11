import { expect, test, describe } from 'vitest';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

describe('Authentication Integration Tests', () => {
  test('should register a new user', async () => {
    const email = `test-${Date.now()}@example.com`;
    const { data, error } = await supabase.auth.signUp({
      email,
      password: 'Test123!@#',
      options: {
        data: {
          full_name: 'Test User',
          role: 'buyer',
        },
      },
    });

    expect(error).toBeNull();
    expect(data.user).toBeDefined();
    expect(data.user?.email).toBe(email);
    expect(data.user?.user_metadata.role).toBe('buyer');
  });

  test('should not allow duplicate email registration', async () => {
    const email = `test-${Date.now()}@example.com`;
    
    // First registration
    await supabase.auth.signUp({
      email,
      password: 'Test123!@#',
    });

    // Attempt duplicate registration
    const { error } = await supabase.auth.signUp({
      email,
      password: 'Test123!@#',
    });

    expect(error).toBeDefined();
    expect(error?.message).toContain('User already registered');
  });
});