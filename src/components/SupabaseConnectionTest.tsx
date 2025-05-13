import { useState, useEffect } from 'react';
import { testSupabaseConnection } from '../lib/supabase';

const SupabaseConnectionTest = () => {
  const [connectionStatus, setConnectionStatus] = useState<{
    tested: boolean;
    success?: boolean;
    message?: string;
    error?: any;
  }>({
    tested: false
  });

  useEffect(() => {
    const testConnection = async () => {
      try {
        console.log('Starting connection test...');
        const result = await testSupabaseConnection();
        
        if (result.success) {
          setConnectionStatus({
            tested: true,
            success: true,
            message: 'Successfully connected to Supabase!'
          });
        } else {
          setConnectionStatus({
            tested: true,
            success: false,
            message: 'Failed to connect to Supabase.',
            error: result.error
          });
        }
      } catch (error) {
        console.error('Error in test component:', error);
        setConnectionStatus({
          tested: true,
          success: false,
          message: 'An error occurred while testing the connection.',
          error
        });
      }
    };

    testConnection();
  }, []);

  return (      <div className="fixed bottom-16 right-4 p-6 max-w-md bg-white rounded-lg shadow-md z-50">
        <h2 className="text-2xl font-bold text-secondary mb-4">Supabase Connection Test</h2>
        {!connectionStatus.tested ? (
          <div className="flex items-center text-gray-600">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Testing connection...
          </div>
        ) : connectionStatus.success ? (
          <div className="text-green-600">
            <p className="flex items-center">
              <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              {connectionStatus.message}
            </p>
          </div>
        ) : (
          <div className="text-red-600">
            <p className="flex items-center">
              <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
              {connectionStatus.message}
            </p>
            {connectionStatus.error && (
              <div className="mt-2 text-sm bg-red-50 p-3 rounded">
                {connectionStatus.error.networkBlocked ? (
                  <div>
                    <p className="font-semibold">Network Access Blocked</p>
                    <p>Your network appears to be blocking access to Supabase. This is common on school or corporate networks.</p>
                    <p className="mt-2">Possible solutions:</p>
                    <ul className="list-disc list-inside mt-1">
                      <li>Try using a different network connection</li>
                      <li>Contact your network administrator to allow access to *.supabase.co</li>
                      <li>Use a mobile hotspot for development</li>
                    </ul>
                  </div>
                ) : (
                  <p>{connectionStatus.error.message}</p>
                )}
              </div>
            )}
          </div>
        )}
      
      {!connectionStatus.tested ? (
        <div className="flex items-center justify-center">
          <div className="w-8 h-8 border-t-4 border-primary rounded-full animate-spin"></div>
          <span className="ml-2">Testing connection...</span>
        </div>
      ) : connectionStatus.success ? (
        <div className="bg-green-100 border-l-4 border-green-500 p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm leading-5 font-medium text-green-800">
                {connectionStatus.message}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-red-100 border-l-4 border-red-500 p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm leading-5 font-medium text-red-800">
                {connectionStatus.message}
              </p>
              {connectionStatus.error && (
                <p className="text-sm leading-5 text-red-700 mt-1">
                  Error details: {JSON.stringify(connectionStatus.error, null, 2)}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="mt-4">
        <h3 className="text-lg font-semibold mb-2">Environment Variables:</h3>
        <div className="bg-gray-100 p-3 rounded">
          <p className="mb-1"><strong>VITE_SUPABASE_URL:</strong> {import.meta.env.VITE_SUPABASE_URL ? '✓ Set' : '✗ Missing'}</p>
          <p><strong>VITE_SUPABASE_ANON_KEY:</strong> {import.meta.env.VITE_SUPABASE_ANON_KEY ? '✓ Set' : '✗ Missing'}</p>
        </div>
      </div>
    </div>
  );
};

export default SupabaseConnectionTest;