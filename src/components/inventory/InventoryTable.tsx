import React from 'react';
import { ChevronDown, ChevronUp, Eye } from 'lucide-react';
import { InventoryItem, SortingState, PaginationState } from '../../types/inventory';
import { useTheme } from '../../contexts/ThemeContext';

interface Props {
  items: InventoryItem[];
  sorting: SortingState;
  onSortingChange: (sorting: SortingState) => void;
  pagination: PaginationState;
  onPaginationChange: (pagination: PaginationState) => void;
  isLoading: boolean;
  onEdit: (item: InventoryItem) => void; // Pass the onEdit function as a prop
}

function InventoryTable({ 
  items, 
  sorting, 
  onSortingChange,
  pagination,
  onPaginationChange,
  isLoading,
  onEdit // Receive onEdit from parent
}: Props) {
  const handleSort = (column: string) => {
    const isAsc = sorting.column === column && sorting.direction === 'asc';
    onSortingChange({
      column,
      direction: isAsc ? 'desc' : 'asc'
    });
  };

  const SortIcon = ({ column }: { column: string }) => {
    if (sorting.column !== column) return null;
    return sorting.direction === 'asc' ? 
      <ChevronUp className="w-4 h-4" /> : 
      <ChevronDown className="w-4 h-4" />;
  };

  if (isLoading) {
    return <div className="text-center py-4">Loading...</div>;
  }

  const { theme } = useTheme();

  return (
    <div className={`${theme === 'dark' ? 'bg-[#1A1025] text-purple-200' : 'bg-white'} shadow rounded-lg overflow-hidden`}>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className={`${theme === 'dark' ? 'bg-[#190a29] text-purple-100' : 'bg-gray-50'}`}>
          <tr>
            {['Ref Num', 'Name', 'Qty. in Stock', 'View'].map((header) => (
              <th
                key={header}
                onClick={() => handleSort(header.toLowerCase())}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              >
                <div className="flex items-center space-x-1">
                  <span>{header}</span>
                  <SortIcon column={header.toLowerCase()} />
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className={`${theme === 'dark' ? 'bg-[#1A1025] text-purple-200 divide-[#2D1F3F]' : 'bg-white divide-gray-200'} divide-y`}>
          {items.map((item) => (
            <tr key={item.id} className={`${theme === 'dark' ? 'hover:bg-[#2D1F3F] hover:text-purple-200' : 'hover:bg-gray-50'}`}>
              <td className={`px-6 py-4 whitespace-nowrap text-sm  ${theme === 'dark' ? 'text-purple-200' : 'text-gray-900'}`}>{item.ref_num}</td>
              <td className={`px-6 py-4 whitespace-nowrap text-sm  ${theme === 'dark' ? 'text-purple-200' : 'text-gray-900'}`}>{item.name}</td>
              <td className={`px-6 py-4 whitespace-nowrap text-sm  ${theme === 'dark' ? 'text-purple-200' : 'text-gray-900'}`}>{item.qty_in_stock}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                <button
                  onClick={() => onEdit(item)}
                  className="text-purple-600 hover:text-purple-800"
                >
                  <Eye className="w-5 h-5 inline" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination Controls */}
      <div className={`${theme === 'dark' ? 'bg-[#1A1025] text-purple-200' : 'bg-white'} px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6`}>
        <div className="flex-1 flex justify-between sm:hidden">
          <button
            onClick={() => onPaginationChange({ ...pagination, page: pagination.page - 1 })}
            disabled={pagination.page === 1}
            className="relative inline-flex items-center px-4 py-2 border border-purple-300 text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700"
          >
            Previous
          </button>
          <button
            onClick={() => onPaginationChange({ ...pagination, page: pagination.page + 1 })}
            disabled={items.length < pagination.pageSize}
            className="ml-3 relative inline-flex items-center px-4 py-2 border border-purple-300 text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default InventoryTable;
