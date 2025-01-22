import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

export function useSettingsData(table: string) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const { data: items } = await supabase
      .from(table)
      .select('*')
      .order('name');
    
    if (items) {
      setData(items);
    }
    setLoading(false);
  };

  const addItem = async (item: any) => {
    const { data: newItem, error } = await supabase
      .from(table)
      .insert([item])
      .select()
      .single();

    if (!error && newItem) {
      setData([...data, newItem]);
      return true;
    }
    return false;
  };

  const updateItem = async (id: string, updates: any) => {
    const { data: updatedItem, error } = await supabase
      .from(table)
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (!error && updatedItem) {
      setData(data.map(item => item.id === id ? updatedItem : item));
      return true;
    }
    return false;
  };

  const deleteItem = async (id: string) => {
    const { error } = await supabase
      .from(table)
      .delete()
      .eq('id', id);

    if (!error) {
      setData(data.filter(item => item.id !== id));
      return true;
    }
    return false;
  };

  return {
    data,
    loading,
    addItem,
    updateItem,
    deleteItem
  };
}