import { createClient } from 'npm:@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

interface UploadRequest {
  fileName: string;
  contentType: string;
  bucket: 'private' | 'public';
  folder: string;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (req.method !== 'POST') {
      throw new Error('Method not allowed');
    }

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );

    // Verify authentication
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
    
    if (authError || !user) {
      throw new Error('Unauthorized');
    }

    const { fileName, contentType, bucket, folder }: UploadRequest = await req.json();

    // Validate request
    if (!fileName || !contentType || !bucket || !folder) {
      throw new Error('Missing required fields');
    }

    // Validate file type
    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ];

    if (!allowedTypes.includes(contentType)) {
      throw new Error('Invalid file type');
    }

    // Generate secure file path
    const fileExt = fileName.split('.').pop();
    const secureFileName = `${crypto.randomUUID()}.${fileExt}`;
    const filePath = `${folder}/${secureFileName}`;

    // Get signed URL for upload
    const { data: signedUrl, error: signedUrlError } = await supabaseAdmin
      .storage
      .from(bucket)
      .createSignedUploadUrl(filePath);

    if (signedUrlError) {
      throw signedUrlError;
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        signedUrl: signedUrl.signedUrl,
        path: filePath
      }),
      { 
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );

  } catch (error) {
    console.error('Error:', error.message);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
      }),
      { 
        status: 400,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  }
});