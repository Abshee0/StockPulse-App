import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface Activity {
  id: string;
  description: string;
  timestamp: string;
}

export function useRecentActivity() {
  const [activities, setActivities] = useState<Activity[]>([]);

  useEffect(() => {
    async function fetchRecentActivity() {
      const { data: stockUpdates } = await supabase
        .from('stock_updates')
        .select(`
          id,
          qty_change,
          update_type,
          update_date,
          items (name)
        `)
        .order('created_at', { ascending: false })
        .limit(5);

      if (stockUpdates) {
        setActivities(
          stockUpdates.map(update => ({
            id: update.id,
            description: `${update.update_type} of ${Math.abs(update.qty_change)} units for ${update.items.name}`,
            timestamp: new Date(update.update_date).toLocaleDateString()
          }))
        );
      }
    }

    fetchRecentActivity();
  }, []);

  return { activities };
}