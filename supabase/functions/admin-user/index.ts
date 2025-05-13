import { createClient } from 'npm:@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

interface CreateUserPayload {
  email: string;
  password: string;
  role: 'user' | 'admin';
}

interface DeleteUserPayload {
  userId: string;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verify request method
    if (req.method !== 'POST' && req.method !== 'DELETE') {
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

    if (req.method === 'POST') {
      // Create new user
      const payload: CreateUserPayload = await req.json();

      const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
        email: payload.email,
        password: payload.password,
        email_confirm: true,
      });

      if (createError || !newUser.user) {
        throw createError || new Error('Failed to create user');
      }

      // Add user role
      const { error: roleError } = await supabaseAdmin
        .from('users')
        .insert([{
          id: newUser.user.id,
          role: payload.role,
        }]);

      if (roleError) {
        // Cleanup: delete the auth user if role assignment fails
        await supabaseAdmin.auth.admin.deleteUser(newUser.user.id);
        throw roleError;
      }

      return new Response(
        JSON.stringify({ 
          success: true, 
          user: {
            id: newUser.user.id,
            email: newUser.user.email,
            role: payload.role,
          }
        }),
        { 
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
        }
      );
    } else if (req.method === 'DELETE') {
      // Delete user
      const payload: DeleteUserPayload = await req.json();

      // Delete user from auth
      const { error: deleteAuthError } = await supabaseAdmin.auth.admin.deleteUser(
        payload.userId
      );

      if (deleteAuthError) {
        throw deleteAuthError;
      }

      // The users table row will be automatically deleted by the foreign key constraint

      return new Response(
        JSON.stringify({ 
          success: true,
          message: 'User deleted successfully'
        }),
        { 
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
        }
      );
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