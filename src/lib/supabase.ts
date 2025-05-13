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
  supabaseAnonKey || ''
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