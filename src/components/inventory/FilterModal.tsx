import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { InventoryFilters as FilterType } from '../../types/inventory';
import { useCategories } from '../../hooks/useCategories';
import { useBrands } from '../../hooks/useBrands';
import { useLocations } from '../../hooks/useLocations';

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterType;
  onFilterChange: (filters: FilterType) => void;
}

const FilterModal: React.FC<FilterModalProps> = ({ isOpen, onClose, filters, onFilterChange }) => {
  const { theme } = useTheme();
  const { categories } = useCategories();
  const { brands } = useBrands();
  const { locations } = useLocations();

  // Disable body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto'; // Reset to default when the component unmounts
    };
  }, [isOpen]);

  // Close modal on Escape key press
  useEffect(() => {
    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscapeKey);
    } else {
      document.removeEventListener('keydown', handleEscapeKey);
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center font-display z-10"
      onClick={onClose}
    >
      <div
        className={`  p-6 rounded-lg shadow-lg w-72 ${theme === 'dark' ? 'text-purple-200 bg-[#1A1025]' : 'text-gray-900 bg-white'}`}
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Filter Items</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <X className="w-5 h-5" />
          </button>
        </div>
       

        <div className='flex flex-col space-y-6'>
        <select
          value={filters.category}
          onChange={(e) => onFilterChange({ ...filters, category: e.target.value })}
          className={`rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 ${theme === 'dark' ? 'bg-[#302042] text-purple-200' : 'bg-violet-100'} h-9`}
        >
          <option value="">All Categories</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>{category.name}</option>
          ))}
        </select>

        <select
          value={filters.brand}
          onChange={(e) => onFilterChange({ ...filters, brand: e.target.value })}
          className={`rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${theme === 'dark' ? 'bg-[#302042] text-purple-200' : 'bg-violet-100'} h-9`}
        >
          <option value="">All Brands</option>
          {brands.map((brand) => (
            <option key={brand.id} value={brand.id}>{brand.name}</option>
          ))}
        </select>

        <select
          value={filters.location}
          onChange={(e) => onFilterChange({ ...filters, location: e.target.value })}
          className={`rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${theme === 'dark' ? 'bg-[#302042] text-purple-200' : 'bg-violet-100'} h-9`}
        >
          <option value="">All Locations</option>
          {locations.map((location) => (
            <option key={location.id} value={location.id}>{location.name}</option>
          ))}
        </select>
        </div>

      </div>
    </div>
  );
};

export default FilterModal;
