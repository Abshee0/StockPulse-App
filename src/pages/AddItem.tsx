import React from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useCategories } from '../hooks/useCategories';
import { useBrands } from '../hooks/useBrands';
import { useLocations } from '../hooks/useLocations';
import { useTheme } from '../contexts/ThemeContext';

function AddItem() {
  const navigate = useNavigate();
  const { categories } = useCategories();
  const { brands } = useBrands();
  const { locations } = useLocations();
  const { theme } = useTheme();
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const itemData = {
      ref_num: formData.get('ref_num'),
      name: formData.get('name'),
      category_id: formData.get('category_id'),
      brand_id: formData.get('brand_id'),
      location_id: formData.get('location_id'),
      qty_in_stock: parseInt(formData.get('qty_in_stock') as string, 10),
      unit: formData.get('unit'),
      lot_num: formData.get('lot_num'),
      expiry_date: formData.get('expiry_date'),
      pack_size: parseInt(formData.get('pack_size') as string, 10),
      reorder_level: parseInt(formData.get('reorder_level') as string, 10),
      remarks: formData.get('remarks')
    };

    const { error } = await supabase.from('items').insert([itemData]);
    
    if (!error) {
      navigate('/inventory');
    }
  };

  return (
    <div className="space-y-6">
      <h1 className={`${theme === 'dark' ? 'text-purple-200' : 'text-gray-900'} text-2xl font-semibold text-gray-900`}>Add New Item</h1>
      
      <form onSubmit={handleSubmit} className={`${theme === 'dark' ? 'bg-[#1A1025] text-purple-200' : 'bg-white'} shadow rounded-lg p-6 space-y-6`}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className={`block text-sm font-medium ${theme === 'dark' ? 'text-purple-200' : 'text-gray-700'} `}>Reference Number</label>
            <input
              type="text"
              name="ref_num"
              required
              className={`mt-1 block w-full rounded-md border-purple-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 h-9 ${theme === 'dark' ? 'bg-[#2D1F3F] text-purple-200' : 'bg-gray-100 text-gray-700'}`}
            />
          </div>

          <div>
            <label className={`block text-sm font-medium ${theme === 'dark' ? 'text-purple-200' : 'text-gray-700'} `}>Item Name</label>
            <input
              type="text"
              name="name"
              required
              className={`mt-1 block w-full rounded-md border-purple-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 h-9 ${theme === 'dark' ? 'bg-[#2D1F3F] text-purple-200' : 'bg-gray-100 text-gray-700'}`}
            />
          </div>

          <div>
            <label className={`block text-sm font-medium ${theme === 'dark' ? 'text-purple-200' : 'text-gray-700'} `}>Category</label>
            <select
              name="category_id"
              required
              className={`mt-1 block w-full rounded-md border-purple-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 h-9 ${theme === 'dark' ? 'bg-[#2D1F3F] text-purple-200' : 'bg-gray-100 text-gray-700'}`}
            >
              <option value="">Select Category</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>{category.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className={`block text-sm font-medium ${theme === 'dark' ? 'text-purple-200' : 'text-gray-700'} `}>Brand</label>
            <select
              name="brand_id"
              required
              className={`mt-1 block w-full rounded-md border-purple-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 h-9 ${theme === 'dark' ? 'bg-[#2D1F3F] text-purple-200' : 'bg-gray-100 text-gray-700'}`}
            >
              <option value="">Select Brand</option>
              {brands.map(brand => (
                <option key={brand.id} value={brand.id}>{brand.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className={`block text-sm font-medium ${theme === 'dark' ? 'text-purple-200' : 'text-gray-700'} `}>Location</label>
            <select
              name="location_id"
              required
              className={`mt-1 block w-full rounded-md border-purple-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 h-9 ${theme === 'dark' ? 'bg-[#2D1F3F] text-purple-200' : 'bg-gray-100 text-gray-700'}`}
            >
              <option value="">Select Location</option>
              {locations.map(location => (
                <option key={location.id} value={location.id}>{location.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className={`block text-sm font-medium ${theme === 'dark' ? 'text-purple-200' : 'text-gray-700'} `}>Quantity in Stock</label>
            <input
              type="number"
              name="qty_in_stock"
              required
              min="0"
              className={`mt-1 block w-full rounded-md border-purple-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 h-9 ${theme === 'dark' ? 'bg-[#2D1F3F] text-purple-200' : 'bg-gray-100 text-gray-700'}`}
            />
          </div>

          <div>
            <label className={`block text-sm font-medium ${theme === 'dark' ? 'text-purple-200' : 'text-gray-700'} `}>Unit</label>
            <input
              type="text"
              name="unit"
              required
              className={`mt-1 block w-full rounded-md border-purple-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 h-9 ${theme === 'dark' ? 'bg-[#2D1F3F] text-purple-200' : 'bg-gray-100 text-gray-700'}`}
            />
          </div>

          <div>
            <label className={`block text-sm font-medium ${theme === 'dark' ? 'text-purple-200' : 'text-gray-700'} `}>Lot Number</label>
            <input
              type="text"
              name="lot_num"
              className={`mt-1 block w-full rounded-md border-purple-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 h-9 ${theme === 'dark' ? 'bg-[#2D1F3F] text-purple-200' : 'bg-gray-100 text-gray-700'}`}
            />
          </div>

          <div>
            <label className={`block text-sm font-medium ${theme === 'dark' ? 'text-purple-200' : 'text-gray-700'} `}>Expiry Date</label>
            <input
              type="date"
              name="expiry_date"
              className={`mt-1 block w-full rounded-md border-purple-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 h-9 ${theme === 'dark' ? 'bg-[#2D1F3F] text-purple-200' : 'bg-gray-100 text-gray-700'}`}
            />
          </div>

          <div>
            <label className={`block text-sm font-medium ${theme === 'dark' ? 'text-purple-200' : 'text-gray-700'} `}>Pack Size</label>
            <input
              type="number"
              name="pack_size"
              min="1"
              className={`mt-1 block w-full rounded-md border-purple-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 h-9 ${theme === 'dark' ? 'bg-[#2D1F3F] text-purple-200' : 'bg-gray-100 text-gray-700'}`}
            />
          </div>

          <div>
            <label className={`block text-sm font-medium ${theme === 'dark' ? 'text-purple-200' : 'text-gray-700'} `}>Reorder Level</label>
            <input
              type="number"
              name="reorder_level"
              min="0"
              className={`mt-1 block w-full rounded-md border-purple-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 h-9 ${theme === 'dark' ? 'bg-[#2D1F3F] text-purple-200' : 'bg-gray-100 text-gray-700'}`}
            />
          </div>

          <div className="col-span-2">
            <label className={`block text-sm font-medium ${theme === 'dark' ? 'text-purple-200' : 'text-gray-700'} `}>Remarks</label>
            <textarea
              name="remarks"
              rows={3}
              className={`mt-1 block w-full rounded-md border-purple-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 ${theme === 'dark' ? 'bg-[#2D1F3F] text-purple-200' : 'bg-gray-100 text-gray-700'}`}
            ></textarea>
          </div>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => navigate('/inventory')}
            className={`px-4 py-2 border border-gray-300 rounded-md text-sm font-medium ${theme === 'dark' ? 'text-purple-200 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-50'} `}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700"
          >
            Add Item
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddItem;