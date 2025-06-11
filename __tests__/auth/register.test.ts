import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { createClient } from '@supabase/supabase-js';
import { POST as registerHandler } from '@/app/api/auth/register/route';

const testUser = {
  email: 'test@example.com',
  password: 'Test123!@#',
  fullName: 'Test User',
  phoneNumber: '1234567890',
  address: {
    line1: '123 Test St',
    city: 'Test City',
    state: 'Test State',
    postalCode: '12345',
  },
};

describe('Registration API', () => {
  let supabase: any;

  beforeEach(() => {
    supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
  });

  afterEach(async () => {
    // Clean up test user
    const { data: { user } } = await supabase.auth.signIn({
      email: testUser.email,
      password: testUser.password,
    });

    if (user) {
      await supabase.auth.admin.deleteUser(user.id);
    }
  });

  it('should validate email format', async () => {
    const request = new Request('http://localhost:3000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...testUser,
        email: 'invalid-email',
      }),
    });

    const response = await registerHandler(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toContain('Invalid email');
  });

  it('should validate password requirements', async () => {
    const request = new Request('http://localhost:3000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...testUser,
        password: 'weak',
      }),
    });

    const response = await registerHandler(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toContain('Password must');
  });

  it('should create user account successfully', async () => {
    const request = new Request('http://localhost:3000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testUser),
    });

    const response = await registerHandler(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);

    // Verify user exists
    const { data: { user } } = await supabase.auth.signIn({
      email: testUser.email,
      password: testUser.password,
    });

    expect(user).toBeTruthy();
    expect(user.email).toBe(testUser.email);
  });

  it('should create buyer profile', async () => {
    const request = new Request('http://localhost:3000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testUser),
    });

    await registerHandler(request);

    // Sign in and verify profile
    const { data: { user } } = await supabase.auth.signIn({
      email: testUser.email,
      password: testUser.password,
    });

    const { data: profile } = await supabase
      .from('buyer_profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    expect(profile).toBeTruthy();
    expect(profile.full_name).toBe(testUser.fullName);
    expect(profile.phone_number).toBe(testUser.phoneNumber);
    expect(profile.address).toEqual(testUser.address);
  });
});