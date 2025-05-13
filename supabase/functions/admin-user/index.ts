import { createClient } from 'npm:@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
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
    if (!['GET', 'POST', 'DELETE'].includes(req.method)) {
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

    if (req.method === 'GET') {
      // Fetch all users
      const { data: authUsers, error: listError } = await supabaseAdmin.auth.admin.listUsers();
      
      if (listError) {
        throw listError;
      }

      // Get roles from users table
      const { data: rolesData, error: rolesError } = await supabaseAdmin
        .from('users')
        .select('id, role');

      if (rolesError) {
        throw rolesError;
      }

      // Create a map of user roles
      const roleMap = new Map(rolesData.map(user => [user.id, user.role]));

      // Combine the data
      const users = authUsers.users.map(authUser => ({
        id: authUser.id,
        email: authUser.email,
        role: roleMap.get(authUser.id) || 'user',
        created_at: authUser.created_at
      }));

      return new Response(
        JSON.stringify({ 
          success: true,
          users
        }),
        { 
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
        }
      );
    } else if (req.method === 'POST') {
      // Create new user
      const payload: CreateUserPayload = await req.json();

      // Check if user already exists in auth
      const { data: existingUsers } = await supabaseAdmin
        .from('auth.users')
        .select('id')
        .eq('email', payload.email)
        .limit(1);

      if (existingUsers && existingUsers.length > 0) {
        throw new Error('A user with this email already exists');
      }

      const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
        email: payload.email,
        password: payload.password,
        email_confirm: true,
      });

      if (createError || !newUser.user) {
        throw createError || new Error('Failed to create user');
      }

      // Check if user already exists in users table
      const { data: existingUser } = await supabaseAdmin
        .from('users')
        .select('id')
        .eq('id', newUser.user.id)
        .single();

      if (!existingUser) {
        // Only insert if user doesn't exist
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

      // First, verify the user exists in auth
      const { data: authUser, error: authUserError } = await supabaseAdmin.auth.admin.getUserById(
        payload.userId
      );

      if (authUserError || !authUser.user) {
        throw new Error('User not found in auth system');
      }

      // Check if user exists and is not the last admin
      const { data: userToDelete, error: userCheckError } = await supabaseAdmin
        .from('users')
        .select('role')
        .eq('id', payload.userId)
        .single();

      if (userCheckError) {
        throw new Error(`Failed to check user status: ${userCheckError.message}`);
      }

      if (userToDelete?.role === 'admin') {
        // Count remaining admins
        const { count, error: countError } = await supabaseAdmin
          .from('users')
          .select('*', { count: 'exact', head: true })
          .eq('role', 'admin');

        if (countError) {
          throw new Error(`Failed to count admins: ${countError.message}`);
        }

        if (count === 1) {
          throw new Error('Cannot delete the last admin user');
        }
      }

      // Delete any conference registrations associated with the user
      const { error: regDeleteError } = await supabaseAdmin
        .from('conference_registrations')
        .delete()
        .eq('id', payload.userId);

      if (regDeleteError) {
        console.error('Error deleting conference registrations:', regDeleteError);
        // Continue with deletion even if this fails
      }

      // Delete the user from the users table first
      const { error: userDeleteError } = await supabaseAdmin
        .from('users')
        .delete()
        .eq('id', payload.userId);

      if (userDeleteError) {
        throw new Error(`Failed to delete user from users table: ${userDeleteError.message}`);
      }

      // Finally, delete user from auth
      const { error: deleteAuthError } = await supabaseAdmin.auth.admin.deleteUser(
        payload.userId
      );

      if (deleteAuthError) {
        // If auth deletion fails, we should try to rollback the users table deletion
        try {
          await supabaseAdmin
            .from('users')
            .insert([{ id: payload.userId, role: userToDelete?.role || 'user' }]);
        } catch (rollbackError) {
          console.error('Failed to rollback user deletion:', rollbackError);
        }
        throw new Error(`Failed to delete user from auth: ${deleteAuthError.message}`);
      }

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