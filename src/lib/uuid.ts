export async function generateUUID(): Promise<string> {
  try {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    if (!supabaseUrl) {
      throw new Error('VITE_SUPABASE_URL is not defined');
    }

    const response = await fetch(
      `${supabaseUrl}/functions/v1/generate-uuid`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
      }
    );

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.error || 'Failed to generate UUID');
    }

    return result.uuid;
  } catch (error) {
    console.error('Error generating UUID:', error);
    throw error;
  }
}