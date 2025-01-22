import React, { useState } from 'react';
import { Search, Filter } from 'lucide-react';
import {useTheme} from '../../contexts/ThemeContext'
import FilterModal from './FilterModal';
import { InventoryFilters as FilterType } from '../../types/inventory';
import { useCategories } from '../../hooks/useCategories';
import { useBrands } from '../../hooks/useBrands';
import { useLocations } from '../../hooks/useLocations';

interface Props {
  filters: FilterType;
  onFilterChange: (filters: FilterType) => void;
}

function InventoryFilters({ filters, onFilterChange }: Props) {
  const { theme } = useTheme();
  const { categories } = useCategories();
  const { brands } = useBrands();
  const { locations } = useLocations();
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const togglePopup = () => setIsPopupOpen(!isPopupOpen);

  return (
    <div className={`${theme === 'dark' ? 'bg-[#1A1025] text-purple-200' : 'bg-white'} p-4 rounded-lg shadow space-y-4`}>
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-1 top-1 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search items..."
            value={filters.search}
            onChange={(e) => onFilterChange({ ...filters, search: e.target.value })}
            className={`pl-10 w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 ${theme === 'dark' ? 'bg-[#1A1025] text-purple-200' : 'bg-white'}`}
          />
          <button onClick={togglePopup}>
            <Filter className="absolute right-1 top-1 h-5 w-5 text-violet-300" />
          </button>
        </div>
      </div>

      {/* Filter Modal */}
      <FilterModal
        isOpen={isPopupOpen}
        onClose={togglePopup}
        filters={filters}
        onFilterChange={onFilterChange}
        categories={categories}
        brands={brands}
        locations={locations}
      />
    </div>
  );
}

export default InventoryFilters;