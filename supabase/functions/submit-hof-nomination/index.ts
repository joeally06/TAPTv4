import { createClient } from 'npm:@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

interface NominationPayload {
  nominee_first_name: string;
  nominee_last_name: string;
  district: string;
  years_of_service: number;
  is_tapt_member: boolean;
  nomination_reason: string;
  supervisor_first_name: string;
  supervisor_last_name: string;
  supervisor_email: string;
  nominee_city: string;
  region: string;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verify request method
    if (req.method !== 'POST') {
      throw new Error('Method not allowed');
    }

    // Create Supabase client with service role key
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

    // Get request body
    const payload: NominationPayload = await req.json();

    // Validate required fields
    const requiredFields = [
      'nominee_first_name',
      'nominee_last_name',
      'district',
      'years_of_service',
      'nomination_reason',
      'supervisor_first_name',
      'supervisor_last_name',
      'supervisor_email',
      'nominee_city',
      'region'
    ];

    for (const field of requiredFields) {
      if (!payload[field as keyof NominationPayload]) {
        throw new Error(`Missing required field: ${field}`);
      }
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(payload.supervisor_email)) {
      throw new Error('Invalid email format');
    }

    // Check if nomination period is open
    const { data: settings, error: settingsError } = await supabaseAdmin
      .from('hall_of_fame_settings')
      .select('*')
      .eq('is_active', true)
      .single();

    if (settingsError) {
      throw new Error('Failed to check nomination period');
    }

    if (!settings) {
      throw new Error('Nominations are not currently open');
    }

    const now = new Date();
    const startDate = new Date(settings.start_date);
    const endDate = new Date(settings.end_date);

    if (now < startDate) {
      throw new Error(`Nominations open on ${startDate.toLocaleDateString()}`);
    }

    if (now > endDate) {
      throw new Error(`Nominations closed on ${endDate.toLocaleDateString()}`);
    }

    // Insert nomination
    const { data, error } = await supabaseAdmin
      .from('hall_of_fame_nominations')
      .insert([{
        ...payload,
        status: 'pending'
      }])
      .select()
      .single();

    if (error) throw error;

    return new Response(
      JSON.stringify({ 
        success: true,
        data
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