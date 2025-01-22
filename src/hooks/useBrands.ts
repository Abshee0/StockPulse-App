import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface Brand {
  id: string;
  name: string;
}

export function useBrands() {
  const [brands, setBrands] = useState<Brand[]>([]);

  useEffect(() => {
    async function fetchBrands() {
      const { data } = await supabase
        .from('brands')
        .select('id, name')
        .order('name');

      if (data) {
        setBrands(data);
      }
    }

    fetchBrands();
  }, []);

  return { brands };
}