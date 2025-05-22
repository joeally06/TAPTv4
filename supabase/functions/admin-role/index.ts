import { createClient } from 'npm:@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

interface RoleAssignmentPayload {
  userId: string;
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

    // Verify the requesting user exists and is authenticated
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
    
    if (authError || !user) {
      throw new Error('Unauthorized');
    }

    // Get request body
    const { userId }: RoleAssignmentPayload = await req.json();

    if (!userId) {
      throw new Error('User ID is required');
    }

    // Verify the user exists in auth.users
    const { data: authUser, error: userError } = await supabaseAdmin.auth.admin.getUserById(
      userId
    );

    if (userError || !authUser.user) {
      throw new Error('User not found');
    }

    // Check if any admin exists
    const { count: adminCount, error: countError } = await supabaseAdmin
      .from('users')
      .select('*', { count: 'exact', head: true })
      .eq('role', 'admin');

    if (countError) {
      throw new Error('Failed to check admin count');
    }

    // If no admin exists, allow the first user to become admin
    if (adminCount === 0) {
      const { error: insertError } = await supabaseAdmin
        .from('users')
        .upsert({
          id: userId,
          role: 'admin'
        });

      if (insertError) {
        throw new Error('Failed to assign admin role');
      }

      return new Response(
        JSON.stringify({ 
          success: true,
          message: 'Admin role assigned successfully'
        }),
        { 
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
        }
      );
    }

    // If admins exist, only allow existing admins to assign admin role
    const { data: requestingUser, error: roleError } = await supabaseAdmin
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single();

    if (roleError) {
      throw new Error('Failed to verify user role');
    }

    if (!requestingUser || requestingUser.role !== 'admin') {
      throw new Error('Only existing admins can assign admin role');
    }

    // Assign admin role
    const { error: updateError } = await supabaseAdmin
      .from('users')
      .upsert({
        id: userId,
        role: 'admin'
      });

    if (updateError) {
      throw new Error('Failed to assign admin role');
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        message: 'Admin role assigned successfully'
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