import { beforeAll, afterAll, afterEach } from 'vitest';
import { createClient } from '@supabase/supabase-js';
import { execSync } from 'child_process';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

beforeAll(async () => {
  // Reset the database before running integration tests
  execSync('npx supabase db reset');
});

afterEach(async () => {
  // Clean up test data after each test
  const { data: { user } } = await supabase.auth.getUser();
  if (user) {
    await supabase.auth.signOut();
  }
});

afterAll(async () => {
  // Final cleanup
  const { error } = await supabase.auth.signOut();
  if (error) console.error('Error during cleanup:', error);
});