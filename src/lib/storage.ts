export async function getSignedUploadUrl(file: File, folder: string, bucket: 'private' | 'public' = 'private') {
  try {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    if (!supabaseUrl) {
      throw new Error('VITE_SUPABASE_URL is not defined');
    }

    const response = await fetch(
      `${supabaseUrl}/functions/v1/secure-upload`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          fileName: file.name,
          contentType: file.type,
          bucket,
          folder
        }),
      }
    );

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.error || 'Failed to get upload URL');
    }

    // Upload file using signed URL
    const uploadResponse = await fetch(result.signedUrl, {
      method: 'PUT',
      body: file,
      headers: {
        'Content-Type': file.type
      }
    });

    if (!uploadResponse.ok) {
      throw new Error('Failed to upload file');
    }

    // Return the file path
    return result.path;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
}

export function getPublicUrl(bucket: string, path: string): string {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  if (!supabaseUrl) {
    throw new Error('VITE_SUPABASE_URL is not defined');
  }
  return `${supabaseUrl}/storage/v1/object/public/${bucket}/${path}`;
}