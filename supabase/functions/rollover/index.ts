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

    // Extract year from settings
    const settingsYear = new Date(settings.start_date).getFullYear();
    
    // Check for existing archive based on type
    let existingArchiveQuery;
    switch (type) {
      case 'conference':
        existingArchiveQuery = await supabaseAdmin
          .from('conference_registrations_archive')
          .select('archived_at')
          .gte('archived_at', `${settingsYear}-01-01`)
          .lte('archived_at', `${settingsYear}-12-31`)
          .limit(1);
        break;
      case 'tech-conference':
        existingArchiveQuery = await supabaseAdmin
          .from('tech_conference_registrations_archive')
          .select('archived_at')
          .gte('archived_at', `${settingsYear}-01-01`)
          .lte('archived_at', `${settingsYear}-12-31`)
          .limit(1);
        break;
      case 'hall-of-fame':
        existingArchiveQuery = await supabaseAdmin
          .from('hall_of_fame_nominations_archive')
          .select('archived_at')
          .gte('archived_at', `${settingsYear}-01-01`)
          .lte('archived_at', `${settingsYear}-12-31`)
          .limit(1);
        break;
      default:
        throw new Error('Invalid rollover type');
    }

    if (existingArchiveQuery.error) {
      throw existingArchiveQuery.error;
    }

    if (existingArchiveQuery.data && existingArchiveQuery.data.length > 0) {
      throw new Error(`A rollover for year ${settingsYear} has already been performed`);
    }

    let archiveId: string | null = null;

    // Archive current data based on type
    switch (type) {
      case 'conference': {
        // Get current registrations
        const { data: registrations } = await supabaseAdmin
          .from('conference_registrations')
          .select('*');

        if (registrations && registrations.length > 0) {
          // Generate new archive ID
          archiveId = crypto.randomUUID();

          // Insert into archive with new IDs
          const archiveData = registrations.map(reg => ({
            ...reg,
            id: crypto.randomUUID(),
            original_id: reg.id,
            archived_at: new Date().toISOString(),
            archive_id: archiveId
          }));

          const { error: archiveError } = await supabaseAdmin
            .from('conference_registrations_archive')
            .insert(archiveData);

          if (archiveError) throw archiveError;

          // Get attendees
          const { data: attendees } = await supabaseAdmin
            .from('conference_attendees')
            .select('*');

          if (attendees && attendees.length > 0) {
            // Archive attendees with new IDs
            const attendeeArchiveData = attendees.map(att => ({
              ...att,
              id: crypto.randomUUID(),
              original_id: att.id,
              archived_at: new Date().toISOString(),
              archive_id: archiveId
            }));

            const { error: attendeesArchiveError } = await supabaseAdmin
              .from('conference_attendees_archive')
              .insert(attendeeArchiveData);

            if (attendeesArchiveError) throw attendeesArchiveError;
          }

          // Delete all records from the original tables
          const { error: deleteAttendeesError } = await supabaseAdmin
            .from('conference_attendees')
            .delete()
            .not('id', 'is', null);

          if (deleteAttendeesError) throw deleteAttendeesError;

          const { error: deleteRegistrationsError } = await supabaseAdmin
            .from('conference_registrations')
            .delete()
            .not('id', 'is', null);

          if (deleteRegistrationsError) throw deleteRegistrationsError;
        }

        // Update settings
        await supabaseAdmin
          .from('conference_settings')
          .update({ is_active: false })
          .neq('id', '00000000-0000-0000-0000-000000000000');

        await supabaseAdmin
          .from('conference_settings')
          .insert({ ...settings, is_active: true });

        break;
      }

      case 'tech-conference': {
        // Get current registrations
        const { data: registrations } = await supabaseAdmin
          .from('tech_conference_registrations')
          .select('*');

        if (registrations && registrations.length > 0) {
          // Generate new archive ID
          archiveId = crypto.randomUUID();

          // Insert into archive with new IDs
          const archiveData = registrations.map(reg => ({
            ...reg,
            id: crypto.randomUUID(),
            original_id: reg.id,
            archived_at: new Date().toISOString(),
            archive_id: archiveId
          }));

          const { error: archiveError } = await supabaseAdmin
            .from('tech_conference_registrations_archive')
            .insert(archiveData);

          if (archiveError) throw archiveError;

          // Get attendees
          const { data: attendees } = await supabaseAdmin
            .from('tech_conference_attendees')
            .select('*');

          if (attendees && attendees.length > 0) {
            // Archive attendees with new IDs
            const attendeeArchiveData = attendees.map(att => ({
              ...att,
              id: crypto.randomUUID(),
              original_id: att.id,
              archived_at: new Date().toISOString(),
              archive_id: archiveId
            }));

            const { error: attendeesArchiveError } = await supabaseAdmin
              .from('tech_conference_attendees_archive')
              .insert(attendeeArchiveData);

            if (attendeesArchiveError) throw attendeesArchiveError;
          }

          // Delete all records from the original tables
          const { error: deleteAttendeesError } = await supabaseAdmin
            .from('tech_conference_attendees')
            .delete()
            .not('id', 'is', null);

          if (deleteAttendeesError) throw deleteAttendeesError;

          const { error: deleteRegistrationsError } = await supabaseAdmin
            .from('tech_conference_registrations')
            .delete()
            .not('id', 'is', null);

          if (deleteRegistrationsError) throw deleteRegistrationsError;
        }

        // Update settings
        await supabaseAdmin
          .from('tech_conference_settings')
          .update({ is_active: false })
          .neq('id', '00000000-0000-0000-0000-000000000000');

        await supabaseAdmin
          .from('tech_conference_settings')
          .insert({ ...settings, is_active: true });

        break;
      }

      case 'hall-of-fame': {
        // Get current nominations
        const { data: nominations } = await supabaseAdmin
          .from('hall_of_fame_nominations')
          .select('*');

        if (nominations && nominations.length > 0) {
          // Generate new archive ID
          archiveId = crypto.randomUUID();

          // Insert into archive with new IDs
          const archiveData = nominations.map(nom => ({
            ...nom,
            id: crypto.randomUUID(),
            original_id: nom.id,
            archived_at: new Date().toISOString(),
            archive_id: archiveId
          }));

          const { error: archiveError } = await supabaseAdmin
            .from('hall_of_fame_nominations_archive')
            .insert(archiveData);

          if (archiveError) throw archiveError;

          // Delete all records from the original table
          const { error: deleteNominationsError } = await supabaseAdmin
            .from('hall_of_fame_nominations')
            .delete()
            .not('id', 'is', null);

          if (deleteNominationsError) throw deleteNominationsError;
        }

        // Update settings
        await supabaseAdmin
          .from('hall_of_fame_settings')
          .update({ is_active: false })
          .neq('id', '00000000-0000-0000-0000-000000000000');

        await supabaseAdmin
          .from('hall_of_fame_settings')
          .insert({ ...settings, is_active: true });

        break;
      }

      default:
        throw new Error('Invalid rollover type');
    }

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