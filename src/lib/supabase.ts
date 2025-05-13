import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables');
  console.log('URL:', supabaseUrl);
  console.log('Key exists:', !!supabaseAnonKey);
}

export const supabase = createClient(
  supabaseUrl || '',
  supabaseAnonKey || '',
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
      // Set session timeout to 8 hours
      storageKey: 'supabase.auth.token',
      storage: {
        getItem: (key) => {
          const item = localStorage.getItem(key);
          if (!item) return null;
          
          const data = JSON.parse(item);
          const expiresAt = new Date(data.expires_at).getTime();
          const now = new Date().getTime();
          
          // Check if session has expired (8 hours)
          if (now - data.created_at > 8 * 60 * 60 * 1000 || now > expiresAt) {
            localStorage.removeItem(key);
            return null;
          }
          
          return item;
        },
        setItem: (key, value) => {
          const data = JSON.parse(value);
          data.created_at = new Date().getTime();
          localStorage.setItem(key, JSON.stringify(data));
        },
        removeItem: (key) => localStorage.removeItem(key)
      }
    }
  }
);

// Test function to verify connection
export const testSupabaseConnection = async () => {
  try {
    console.log('Testing Supabase connection...');
    console.log('URL:', supabaseUrl);
    console.log('Key exists:', !!supabaseAnonKey);
    
    // First test auth
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.error('Session error:', sessionError);
      return { success: false, error: sessionError };
    }

    console.log('Session:', session);

    // Then test data access
    const { data, error } = await supabase
      .from('conference_registrations')
      .select('count')
      .limit(1);
    
    if (error) {
      console.error('Data access error:', error);
      return { success: false, error };
    }
    
    console.log('Data access successful:', data);
    return { success: true, data };
  } catch (error) {
    console.error('Unexpected error:', error);
    return { success: false, error };
  }
};