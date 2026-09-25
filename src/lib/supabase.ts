import { createClient } from '@supabase/supabase-js';

// Sanitize URL by removing /rest/v1 and trailing slashes if user pasted REST endpoint URL
const getCleanSupabaseUrl = (url: string | undefined): string => {
  if (!url) return 'https://placeholder-project.supabase.co';
  return url.trim().replace(/\/rest\/v1\/?$/i, '').replace(/\/+$/, '');
};

const supabaseUrl = getCleanSupabaseUrl(import.meta.env.VITE_SUPABASE_URL);
const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-anon-key').trim();
const supabaseServiceKey = (import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY || '').trim();

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

export const isAdminConfigured = (): boolean => {
  return isSupabaseConfigured() && Boolean(supabaseServiceKey) && !supabaseServiceKey.includes('placeholder');
};

/** Regular client using the anon key — for all standard data operations. */
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Admin client using the service-role key.
 * WARNING: Only use server-side operations via this client.
 * In a browser context this is acceptable only for internal admin tooling
 * where the app itself is the trusted party (not public-facing).
 *
 * Never expose this in a public-facing frontend.
 */
export const supabaseAdmin = isAdminConfigured()
  ? createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })
  : null;
