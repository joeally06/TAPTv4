import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validate environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  const missingVars = [];
  if (!supabaseUrl) missingVars.push('VITE_SUPABASE_URL');
  if (!supabaseAnonKey) missingVars.push('VITE_SUPABASE_ANON_KEY');
  
  const errorMessage = `Missing required Supabase environment variables: ${missingVars.join(', ')}. Please check your .env file.`;
  console.error(errorMessage);
  
  if (import.meta.env.MODE === 'production') {
    throw new Error(errorMessage);
  }
}

// URL format validation
const isValidUrl = (urlString: string): boolean => {
  try {
    new URL(urlString);
    return true;
  } catch {
    return false;
  }
};

if (supabaseUrl && !isValidUrl(supabaseUrl)) {
  const errorMessage = `Invalid Supabase URL format: ${supabaseUrl}`;
  console.error(errorMessage);
  throw new Error(errorMessage);
}

// Create and export the Supabase client
export const supabase = createClient(
  supabaseUrl || '',
  supabaseAnonKey || '',
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
      storage: localStorage,
      storageKey: 'tapt-admin-auth',
    }
  }
);

// Test function
export const testSupabaseConnection = async (): Promise<{ success: boolean; error?: Error }> => {
  try {
    // Try to access a table to verify the connection
    const { error } = await supabase
      .from('conference_registrations')
      .select('count')
      .limit(1)
      .single();
    
    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Supabase connection test failed:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error : new Error('Unknown connection error') 
    };
  }
};

// Function to verify user role
export const verifyUserRole = async (userId: string): Promise<string | null> => {
  try {
    console.log('Verifying user role for ID:', userId);
    
    if (!userId) {
      console.error('No userId provided to verifyUserRole');
      return null;
    }

    const { data, error } = await supabase
      .from('users')
      .select('role')
      .eq('id', userId)
      .maybeSingle();

    if (error) {
      console.error('Error fetching user role:', error);
      throw error;
    }

    if (!data) {
      console.log('No user data found for ID:', userId);
      return null;
    }

    console.log('User role found:', data.role);
    return data.role;

  } catch (error) {
    console.error('Error in verifyUserRole:', error);
    return null;
  }
};