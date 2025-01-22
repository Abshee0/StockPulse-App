export interface InventoryItem {
  id: string;
  ref_num: string;
  name: string;
  category: {
    name: string;
  };
  brand: {
    name: string;
  };
  location: {
    name: string;
  };
  qty_in_stock: number;
  unit: string;
  lot_num?: string;
  expiry_date?: string;
  pack_size?: number;
  reorder_level?: number;
  remarks?: string;
}

export interface InventoryFilters {
  search: string;
  category: string;
  brand: string;
  location: string;
}

export interface SortingState {
  column: string;
  direction: 'asc' | 'desc';
}

export interface PaginationState {
  page: number;
  pageSize: number;
}