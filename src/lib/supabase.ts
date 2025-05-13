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

// Create and export the Supabase client with retry logic
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // Start with 1 second delay

const customFetch = async (url: URL | RequestInfo, options: RequestInit = {}) => {
  let lastError: Error | null = null;
  
  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      if (attempt > 0) {
        console.log(`Retry attempt ${attempt + 1}/${MAX_RETRIES}...`);
      }
      
      const response = await fetch(url, {
        ...options,
        headers: {
          ...options.headers,
          'X-Client-Info': 'TAPT Admin Portal',
        },
      });

      // Check if response is ok
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return response;
    } catch (error) {
      lastError = error instanceof Error ? error : new Error('Network request failed');
      console.error(`Attempt ${attempt + 1} failed:`, lastError);
      
      if (attempt < MAX_RETRIES - 1) {
        // Wait with exponential backoff before retrying
        await new Promise(resolve => 
          setTimeout(resolve, RETRY_DELAY * Math.pow(2, attempt))
        );
      }
    }
  }
  
  throw lastError || new Error('Failed to fetch after multiple retries');
};

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
    },
    global: {
      fetch: customFetch,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
      },
    },
  }
);

// Test function with improved error handling and retries
export const testSupabaseConnection = async (retries = 3): Promise<{ success: boolean; error?: Error; networkBlocked?: boolean }> => {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      console.log(`Testing Supabase connection (attempt ${attempt}/${retries})...`);
      
      // First test if we can reach the domain through proxy
      try {
        // Try both direct and proxied connections
        const urls = [
          'https://tjxnjhjkxldhupitkvqk.supabase.co/rest/v1/health',
          '/rest/v1/health'  // This will be handled by Vite's proxy
        ];

        let success = false;
        for (const url of urls) {
          try {
            const response = await fetch(url);
            if (response.ok) {
              success = true;
              break;
            }
          } catch (e) {
            console.log(`Failed to connect via ${url}:`, e);
          }
        }

        if (!success) {
          return {
            success: false,
            networkBlocked: true,
            error: new Error('Network access to Supabase is blocked. You may be behind a firewall or content filter.')
          };
        }
      } catch (e) {
        if (e instanceof Error && e.message.includes('Failed to fetch')) {
          return {
            success: false,
            networkBlocked: true,
            error: new Error('Network access to Supabase is blocked. You may be behind a firewall or content filter.')
          };
        }
      }
        // Test authentication
      const { error: sessionError } = await supabase.auth.getSession();
      if (sessionError) throw sessionError;

      // Test data access
      const { error: dataError } = await supabase
        .from('conference_registrations')
        .select('count')
        .limit(1)
        .single();
      
      if (dataError) throw dataError;

      console.log('Supabase connection successful');
      return { success: true };

    } catch (error) {
      console.error(`Connection attempt ${attempt} failed:`, error);
      
      if (attempt === retries) {
        return { 
          success: false, 
          error: error instanceof Error ? error : new Error('Unknown connection error') 
        };
      }
      
      // Wait before retrying (exponential backoff)
      await new Promise(resolve => setTimeout(resolve, Math.min(1000 * Math.pow(2, attempt - 1), 5000)));
    }
  }

  return {
    success: false,
    error: new Error('Maximum retry attempts reached')
  };
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