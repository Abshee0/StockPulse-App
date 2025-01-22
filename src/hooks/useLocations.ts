import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface Location {
  id: string;
  name: string;
}

export function useLocations() {
  const [locations, setLocations] = useState<Location[]>([]);

  useEffect(() => {
    async function fetchLocations() {
      const { data } = await supabase
        .from('locations')
        .select('id, name')
        .order('name');

      if (data) {
        setLocations(data);
      }
    }

    fetchLocations();
  }, []);

  return { locations };
}