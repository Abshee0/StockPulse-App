import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export function useInventoryStats() {
  const [totalItems, setTotalItems] = useState(0);
  const [totalValue, setTotalValue] = useState(0);
  const [lowStockItems, setLowStockItems] = useState(0);

  useEffect(() => {
    async function fetchStats() {
      const { data: items } = await supabase
        .from('items')
        .select('qty_in_stock, reorder_level');

      if (items) {
        setTotalItems(items.length);
        setLowStockItems(
          items.filter(item => item.qty_in_stock <= (item.reorder_level || 0)).length
        );
      }
    }

    fetchStats();
  }, []);

  return { totalItems, totalValue, lowStockItems };
}