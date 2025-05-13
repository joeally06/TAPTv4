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
      detectSessionInUrl: true
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

// Function to verify user role with retries
export const verifyUserRole = async (userId: string, maxRetries = 5): Promise<string | null> => {
  let retryCount = 0;
  const baseDelay = 1000; // Start with 1 second delay

  while (retryCount < maxRetries) {
    try {
      console.log(`Attempting to verify user role (Attempt ${retryCount + 1}/${maxRetries})`);
      
      const { data, error } = await supabase
        .from('users')
        .select('role')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        console.error('Error fetching user role:', error);
        throw error;
      }

      if (data?.role) {
        console.log('User role verified:', data.role);
        return data.role;
      }

      // Exponential backoff
      const delay = baseDelay * Math.pow(2, retryCount);
      console.log(`No role found, retrying in ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
      retryCount++;
    } catch (error) {
      console.error(`Retry ${retryCount + 1} failed:`, error);
      retryCount++;
      
      if (retryCount === maxRetries) {
        throw error;
      }
    }
  }

  return null;
};