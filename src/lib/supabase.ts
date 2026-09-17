import { createClient } from '@supabase/supabase-js';

// Sanitize URL by removing /rest/v1 and trailing slashes if user pasted REST endpoint URL
const getCleanSupabaseUrl = (url: string | undefined): string => {
  if (!url) return 'https://placeholder-project.supabase.co';
  return url.trim().replace(/\/rest\/v1\/?$/i, '').replace(/\/+$/, '');
};

const supabaseUrl = getCleanSupabaseUrl(import.meta.env.VITE_SUPABASE_URL);
const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-anon-key').trim();

export const isSupabaseConfigured = (): boolean => {
  const url = import.meta.env.VITE_SUPABASE_URL || '';
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
  return (
    Boolean(url) &&
    Boolean(key) &&
    !url.includes('placeholder') &&
    !url.includes('your-supabase-project') &&
    !key.includes('placeholder') &&
    !key.includes('your-supabase-anon-key')
  );
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
