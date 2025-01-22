import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { InventoryItem, InventoryFilters, SortingState, PaginationState } from '../types/inventory';

export function useInventory() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<InventoryFilters>({
    search: '',
    category: '',
    brand: '',
    location: ''
  });
  const [sorting, setSorting] = useState<SortingState>({
    column: 'name',
    direction: 'asc'
  });
  const [pagination, setPagination] = useState<PaginationState>({
    page: 1,
    pageSize: 10
  });

  const fetchItems = useCallback(async () => {
    setIsLoading(true);
    let query = supabase
      .from('items')
      .select(`
        *,
        category:categories!fk_items_category(id, name),
        brand:brands!items_brand_id_fkey(id, name),
        location:locations!items_location_id_fkey(id, name)
      `)
      .order(sorting.column, { ascending: sorting.direction === 'asc' })
      .range(
        (pagination.page - 1) * pagination.pageSize,
        pagination.page * pagination.pageSize - 1
      );

    if (filters.search) {
      query = query.or(`name.ilike.%${filters.search}%,ref_num.ilike.%${filters.search}%`);
    }
    if (filters.category) {
      query = query.eq('category_id', filters.category);
    }
    if (filters.brand) {
      query = query.eq('brand_id', filters.brand);
    }
    if (filters.location) {
      query = query.eq('location_id', filters.location);
    }

    const { data } = await query;
    
    if (data) {
      setItems(data);
    }
    setIsLoading(false);
  }, [filters, sorting, pagination]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const updateItem = async (id: string, updates: Partial<InventoryItem>) => {
    const { error } = await supabase
      .from('items')
      .update(updates)
      .eq('id', id);

    if (error) throw error;
    await fetchItems();
  };

  return {
    items,
    filters,
    setFilters,
    sorting,
    setSorting,
    pagination,
    setPagination,
    isLoading,
    updateItem,
    refetchItems: fetchItems
  };
}