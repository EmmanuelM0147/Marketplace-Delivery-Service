import { createClient } from '@supabase/supabase-js';
import { Database } from '@/lib/supabase/types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  // In development, show a helpful message
  if (process.env.NODE_ENV === 'development') {
    console.warn(
      'Supabase credentials not found. Please add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to your .env file.'
    );
  }
}

export const supabase = createClient<Database>(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key',
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true
    },
    global: {
      fetch: (url, options) => {
        return fetch(url, {
          ...options,
          credentials: 'include',
        });
      },
    },
  }
);