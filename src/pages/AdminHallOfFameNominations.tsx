import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface AdminHallOfFameNominationsProps {}

export const AdminHallOfFameNominations: React.FC<AdminHallOfFameNominationsProps> = () => {
  const [endDate, setEndDate] = useState<string>('');
  const [savingEndDate, setSavingEndDate] = useState(false);

  const fetchNominations = async () => {
    // Implementation of fetchNominations would go here
  };

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

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Hall of Fame Nominations Admin</h1>
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Set End Date for All Nominations
        </label>
        <input
          type="datetime-local"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        />
        <button
          onClick={saveEndDate}
          disabled={savingEndDate || !endDate}
          className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400"
        >
          {savingEndDate ? 'Saving...' : 'Save End Date'}
        </button>
      </div>
    </div>
  );
};