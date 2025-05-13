// Update the saveEndDate function
const saveEndDate = async () => {
  if (!endDate) return;

  try {
    setSavingEndDate(true);

    // Get the nomination with the earliest created_at date
    const { data: nominations, error: fetchError } = await supabase
      .from('hall_of_fame_nominations')
      .select('id, created_at')
      .order('created_at', { ascending: true })
      .limit(1);

    if (fetchError) throw fetchError;

    if (!nominations || nominations.length === 0) {
      throw new Error('No nominations found');
    }

    const nomination = nominations[0];
    const endDateTime = new Date(endDate);
    const createdAt = new Date(nomination.created_at);

    // Validate end date is after created_at
    if (endDateTime <= createdAt) {
      throw new Error('End date must be after the earliest nomination date');
    }

    // Update all nominations with the new end date
    const { error: updateError } = await supabase
      .from('hall_of_fame_nominations')
      .update({ 
        end_date: endDateTime.toISOString(),
        updated_at: new Date().toISOString()
      });

    if (updateError) throw updateError;

    alert('End date updated successfully');
    await fetchNominations(); // Refresh the nominations list
  } catch (error: any) {
    console.error('Error saving end date:', error);
    alert(error.message || 'Failed to update end date');
  } finally {
    setSavingEndDate(false);
  }
};