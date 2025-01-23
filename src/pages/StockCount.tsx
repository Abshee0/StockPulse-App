import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, ArrowLeft, UploadCloud } from 'lucide-react';
import { useInventory } from '../hooks/useInventory';
import { useCategories } from '../hooks/useCategories';
import { useLocations } from '../hooks/useLocations';
import { InventoryItem } from '../types/inventory';
import {useTheme} from '../contexts/ThemeContext';

function StockCount() {
  const { items, isLoading, updateItem } = useInventory();
  const { categories } = useCategories();
  const { locations } = useLocations();
  const [searchTerm, setSearchTerm] = useState('');
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const { theme } = useTheme();

  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.ref_num.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleUpdateItem = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingItem) return;

    const formData = new FormData(e.currentTarget);
    const updates = {
      qty_in_stock: parseInt(formData.get('qty_in_stock') as string),
      category_id: formData.get('category_id'),
      location_id: formData.get('location_id'),
      expiry_date: formData.get('expiry_date'),
      pack_size: parseInt(formData.get('pack_size') as string),
      reorder_level: parseInt(formData.get('reorder_level') as string),
      remarks: formData.get('remarks')
    };

    try {
      await updateItem(editingItem.id, updates);
      setEditingItem(null);
    } catch (error) {
      console.error('Error updating item:', error);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6 font-display">
      <div className="flex justify-between items-center w-full">
      <Link 
            to='/'
            className='flex-shrink-0'
            >
          <ArrowLeft className={`${theme === 'dark' ? 'text-violet-200' : 'text-gray-900'}`} />
        </Link>
        <h1 className={`${theme === 'dark' ? 'text-violet-200' : 'text-gray-900'} flex-grow text-center text-2xl font-semibold`}>Stock Count</h1>
      </div>


      <div className={`${theme === 'dark' ? 'bg-[#1A1025] text-purple-200' : 'bg-white'} p-4 rounded-lg shadow space-y-4`}>
        <div className="relative">
          <Search className="absolute left-3 top-1 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search items by name or reference number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`pl-10 w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 ${theme === 'dark' ? 'bg-[#1A1025] text-purple-200' : 'bg-white'}`}
          />
        </div>
      </div>

      <div className={`${theme === 'dark' ? 'bg-[#1A1025] text-purple-200' : 'bg-white'} shadow rounded-lg overflow-hidden`}>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className={`${theme === 'dark' ? 'bg-[#190a29] text-purple-100' : 'bg-gray-50'}`}>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ref Num</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">QTY. In Stock</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Update Stock</th>
            </tr>
          </thead>
          <tbody className={`${theme === 'dark' ? 'bg-[#1A1025] text-purple-200 divide-[#2D1F3F]' : 'bg-white divide-gray-200'} divide-y `}>
            {filteredItems.map((item) => (
              <tr key={item.id} className={`${theme === 'dark' ? 'hover:bg-[#2D1F3F] hover:text-purple-200' : 'hover:bg-gray-50'} `}>
                <td className={`px-6 py-4 whitespace-nowrap text-sm  ${theme === 'dark' ? 'text-purple-200' : 'text-gray-900'}`}>{item.ref_num}</td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm  ${theme === 'dark' ? 'text-purple-200' : 'text-gray-900'}`}>{item.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {item.qty_in_stock} {item.unit}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                  <button
                    onClick={() => setEditingItem(item)}
                    className="text-purple-600 hover:text-purple-900"
                  >
                    <UploadCloud />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editingItem && (
        <div className="fixed inset-0 bg-[#1A1025] bg-opacity-50 flex items-center justify-center">
          <div className={`${theme === 'dark' ? 'bg-[#1A1025] text-purple-200' : 'bg-white'} rounded-lg shadow-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto`}>
            <h2 className="text-lg font-medium mb-4">Update Stock: {editingItem.name}</h2>
            <form onSubmit={handleUpdateItem} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={`ml-2 text-sm ${theme === 'dark' ? 'text-purple-200' : 'text-gray-700'}`}>
                    Quantity in Stock
                  </label>
                  <input
                    type="number"
                    name="qty_in_stock"
                    defaultValue={editingItem.qty_in_stock}
                    required
                    min="0"
                    className={`mt-1 pl-2 block w-full rounded-md border-purple-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 h-9 ${theme === 'dark' ? 'bg-[#2D1F3F] text-purple-200' : 'bg-gray-100 text-gray-700'}`}
                  />
                </div>

                <div>
                  <label className={`ml-2 text-sm ${theme === 'dark' ? 'text-purple-200' : 'text-gray-700'}`}>
                    Category
                  </label>
                  <select
                    name="category_id"
                    defaultValue={editingItem.category.id}
                    className={`mt-1 pl-2 block w-full rounded-md border-purple-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 h-9 ${theme === 'dark' ? 'bg-[#2D1F3F] text-purple-200' : 'bg-gray-100 text-gray-700'}`}
                  >
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>{category.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className={`ml-2 text-sm ${theme === 'dark' ? 'text-purple-200' : 'text-gray-700'}`}>
                    Location
                  </label>
                  <select
                    name="location_id"
                    defaultValue={editingItem.location.id}
                    className={`mt-1 pl-2 block w-full rounded-md border-purple-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 h-9 ${theme === 'dark' ? 'bg-[#2D1F3F] text-purple-200' : 'bg-gray-100 text-gray-700'}`}
                  >
                    {locations.map(location => (
                      <option key={location.id} value={location.id}>{location.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className={`ml-2 text-sm ${theme === 'dark' ? 'text-purple-200' : 'text-gray-700'}`}>
                    Expiry Date
                  </label>
                  <input
                    type="date"
                    name="expiry_date"
                    defaultValue={editingItem.expiry_date}
                    className={`mt-1 pl-2 block w-full rounded-md border-purple-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 h-9 ${theme === 'dark' ? 'bg-[#2D1F3F] text-purple-200' : 'bg-gray-100 text-gray-700'}`}
                  />
                </div>

                <div>
                  <label className={`ml-2 text-sm ${theme === 'dark' ? 'text-purple-200' : 'text-gray-700'}`}>
                    Pack Size
                  </label>
                  <input
                    type="number"
                    name="pack_size"
                    defaultValue={editingItem.pack_size}
                    min="1"
                    className={`mt-1 pl-2 block w-full rounded-md border-purple-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 h-9 ${theme === 'dark' ? 'bg-[#2D1F3F] text-purple-200' : 'bg-gray-100 text-gray-700'}`}
                  />
                </div>

                <div>
                  <label className={`ml-2 text-sm ${theme === 'dark' ? 'text-purple-200' : 'text-gray-700'}`}>
                    Reorder Level
                  </label>
                  <input
                    type="number"
                    name="reorder_level"
                    defaultValue={editingItem.reorder_level}
                    min="0"
                    className={`mt-1 pl-2 block w-full rounded-md border-purple-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 h-9 ${theme === 'dark' ? 'bg-[#2D1F3F] text-purple-200' : 'bg-gray-100 text-gray-700'}`}
                  />
                </div>
              </div>

              <div>
                <label className={`ml-2 text-sm ${theme === 'dark' ? 'text-purple-200' : 'text-gray-700'}`}>
                  Remarks
                </label>
                <textarea
                  name="remarks"
                  defaultValue={editingItem.remarks}
                  rows={3}
                  className={`mt-1 pl-2 pt-1 block w-full rounded-md border-purple-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 h-15 ${theme === 'dark' ? 'bg-[#2D1F3F] text-purple-200' : 'bg-gray-100 text-gray-700'}`}
                ></textarea>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className={`px-4 py-2 border border-gray-300 rounded-md text-sm font-medium ${theme === 'dark' ? 'text-purple-200 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-50'}`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700"
                >
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default StockCount;