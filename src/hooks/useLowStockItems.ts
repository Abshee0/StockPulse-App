import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface LowStockItem {
  id: string;
  name: string;
  qty_in_stock: number;
  unit: string;
  reorder_level: number;
}

export function useLowStockItems() {
  const [items, setItems] = useState<LowStockItem[]>([]);

  useEffect(() => {
    async function fetchLowStockItems() {
      const { data } = await supabase
        .rpc('get_low_stock_items')
        .limit(5);

      if (data) {
        setItems(data);
      }
    }

    fetchLowStockItems();
  }, []);

  return { items };
}