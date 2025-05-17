import { createClient } from 'npm:@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

interface RolloverRequest {
  type: 'conference' | 'tech-conference' | 'hall-of-fame';
  settings: Record<string, any>;
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

    // Create authenticated Supabase client using service role key
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

    // Verify the requesting user is an admin
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
    
    if (authError || !user) {
      throw new Error('Unauthorized');
    }

    // Verify user is admin
    const { data: userData, error: userError } = await supabaseAdmin
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single();

    if (userError || !userData || userData.role !== 'admin') {
      throw new Error('Unauthorized - Admin access required');
    }

    // Get request body
    const { type, settings }: RolloverRequest = await req.json();

    // Start transaction
    const { data: client } = await supabaseAdmin.rpc('begin_transaction');

    try {
      let archiveId: string;

      // Archive current data based on type
      switch (type) {
        case 'conference':
          archiveId = await supabaseAdmin.rpc('archive_conference_registrations');
          // Set all existing settings to inactive
          await supabaseAdmin
            .from('conference_settings')
            .update({ is_active: false })
            .neq('id', '00000000-0000-0000-0000-000000000000');
          // Insert new settings
          await supabaseAdmin
            .from('conference_settings')
            .insert({ ...settings, is_active: true });
          break;

        case 'tech-conference':
          archiveId = await supabaseAdmin.rpc('archive_tech_conference_registrations');
          await supabaseAdmin
            .from('tech_conference_settings')
            .update({ is_active: false })
            .neq('id', '00000000-0000-0000-0000-000000000000');
          await supabaseAdmin
            .from('tech_conference_settings')
            .insert({ ...settings, is_active: true });
          break;

        case 'hall-of-fame':
          archiveId = await supabaseAdmin.rpc('archive_hall_of_fame_nominations');
          await supabaseAdmin
            .from('hall_of_fame_settings')
            .update({ is_active: false })
            .neq('id', '00000000-0000-0000-0000-000000000000');
          await supabaseAdmin
            .from('hall_of_fame_settings')
            .insert({ ...settings, is_active: true });
          break;

        default:
          throw new Error('Invalid rollover type');
      }

      // Commit transaction
      await supabaseAdmin.rpc('commit_transaction');

      return new Response(
        JSON.stringify({ 
          success: true,
          archiveId
        }),
        { 
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
        }
      );

    } catch (error) {
      // Rollback transaction on error
      await supabaseAdmin.rpc('rollback_transaction');
      throw error;
    }

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