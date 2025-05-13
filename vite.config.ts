import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  define: {
    'process.env': {},
  },
  server: {
    watch: {
      usePolling: true,
    },
    proxy: {
      '/rest/v1': {
        target: 'https://tjxnjhjkxldhupitkvqk.supabase.co',
        changeOrigin: true,
        secure: false,
        headers: {
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRqeG5qaGpreGxkaHVwaXRrdnFrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY5MDcxOTIsImV4cCI6MjA2MjQ4MzE5Mn0.w2O2vurDZWYuKMOvXPgOW1TBiVGvJg4E8ujDM4EUbws',
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRqeG5qaGpreGxkaHVwaXRrdnFrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY5MDcxOTIsImV4cCI6MjA2MjQ4MzE5Mn0.w2O2vurDZWYuKMOvXPgOW1TBiVGvJg4E8ujDM4EUbws'
        },
      },
      '/auth/v1': {
        target: 'https://tjxnjhjkxldhupitkvqk.supabase.co',
        changeOrigin: true,
        secure: false,
        headers: {
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRqeG5qaGpreGxkaHVwaXRrdnFrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY5MDcxOTIsImV4cCI6MjA2MjQ4MzE5Mn0.w2O2vurDZWYuKMOvXPgOW1TBiVGvJg4E8ujDM4EUbws',
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRqeG5qaGpreGxkaHVwaXRrdnFrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY5MDcxOTIsImV4cCI6MjA2MjQ4MzE5Mn0.w2O2vurDZWYuKMOvXPgOW1TBiVGvJg4E8ujDM4EUbws'
        },
      },
    },
  },
});