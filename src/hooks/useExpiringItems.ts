import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface ExpiringItem {
  id: string;
  name: string;
  expiry_date: string;
  qty_in_stock: number;
  unit: string;
}

export function useExpiringItems() {
  const [items, setItems] = useState<ExpiringItem[]>([]);

  useEffect(() => {
    async function fetchExpiringItems() {
      const threeMonthsFromNow = new Date();
      threeMonthsFromNow.setMonth(threeMonthsFromNow.getMonth() + 3);
      
      const { data } = await supabase
        .from('items')
        .select('id, name, expiry_date, qty_in_stock, unit')
        .not('expiry_date', 'is', null)
        .lte('expiry_date', threeMonthsFromNow.toISOString())
        .gte('expiry_date', new Date().toISOString())
        .order('expiry_date');

      if (data) {
        setItems(data);
      }
    }

    fetchExpiringItems();
  }, []);

  return { items };
}