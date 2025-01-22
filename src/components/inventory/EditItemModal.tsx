import React from 'react';
import { X } from 'lucide-react';
import { useCategories } from '../../hooks/useCategories';
import { useBrands } from '../../hooks/useBrands';
import { useLocations } from '../../hooks/useLocations';
import { useTheme } from '../../contexts/ThemeContext';
import { supabase } from '../../lib/supabase';
import { InventoryItem } from '../../types/inventory';

interface EditItemModalProps {
  item: InventoryItem;
  onClose: () => void;
  onSave: () => void;
}

function EditItemModal({ item, onClose, onSave }: EditItemModalProps) {
  const { categories } = useCategories();
  const { brands } = useBrands();
  const { locations } = useLocations();
  const { theme } = useTheme();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const updates = {
      ref_num: formData.get('ref_num'),
      name: formData.get('name'),
      category_id: formData.get('category_id'),
      brand_id: formData.get('brand_id'),
      location_id: formData.get('location_id'),
      qty_in_stock: parseInt(formData.get('qty_in_stock') as string),
      unit: formData.get('unit'),
      lot_num: formData.get('lot_num') || null,
      expiry_date: formData.get('expiry_date') || null,
      pack_size: parseInt(formData.get('pack_size') as string) || null,
      remarks: formData.get('remarks') || null
    };

    const { error } = await supabase
      .from('items')
      .update(updates)
      .eq('id', item.id);

    if (!error) {
      onSave();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className={`${theme === 'dark' ? 'bg-[#1A1025] text-purple-200' : 'bg-white'} rounded-lg shadow-xl p-6 w-full max-w-2xl`}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Item Details</h2>
          <button onClick={onClose}>
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Reference Number</label>

              <p className={`w-full rounded-md ${theme === 'dark' ? 'bg-[#2D1F3F] text-purple-200' : 'bg-gray-50'} border-gray-300 focus:border-purple-500 focus:ring-purple-500 px-2 py-1`}>
              {item.ref_num}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <p className={`w-full rounded-md ${theme === 'dark' ? 'bg-[#2D1F3F] text-purple-200' : 'bg-gray-50'} border-gray-300 focus:border-purple-500 focus:ring-purple-500 px-2 py-1`}>
              {item.name}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Category</label>
              <p className={`w-full rounded-md ${theme === 'dark' ? 'bg-[#2D1F3F] text-purple-200' : 'bg-gray-50'} border-gray-300 focus:border-purple-500 focus:ring-purple-500 px-2 py-1`}>
              {item.category.name}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Brand</label>
              <p className={`w-full rounded-md ${theme === 'dark' ? 'bg-[#2D1F3F] text-purple-200' : 'bg-gray-50'} border-gray-300 focus:border-purple-500 focus:ring-purple-500 px-2 py-1`}>
              {item.brand.name}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Location</label>
              <p className={`w-full rounded-md ${theme === 'dark' ? 'bg-[#2D1F3F] text-purple-200' : 'bg-gray-50'} border-gray-300 focus:border-purple-500 focus:ring-purple-500 px-2 py-1`}>
              {item.location.name}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Quantity in Stock</label>
              <p className={`w-full rounded-md ${theme === 'dark' ? 'bg-[#2D1F3F] text-purple-200' : 'bg-gray-50'} border-gray-300 focus:border-purple-500 focus:ring-purple-500 px-2 py-1`}>
              {item.qty_in_stock}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Unit</label>
              <p className={`w-full rounded-md ${theme === 'dark' ? 'bg-[#2D1F3F] text-purple-200' : 'bg-gray-50'} border-gray-300 focus:border-purple-500 focus:ring-purple-500 px-2 py-1`}>
              {item.unit}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Pack Size</label>
              <p className={`w-full rounded-md ${theme === 'dark' ? 'bg-[#2D1F3F] text-purple-200' : 'bg-gray-50'} border-gray-300 focus:border-purple-500 focus:ring-purple-500 px-2 py-1`}>
              {item.pack_size}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Lot Number</label>
              <p className={`w-full rounded-md ${theme === 'dark' ? 'bg-[#2D1F3F] text-purple-200' : 'bg-gray-50'} border-gray-300 focus:border-purple-500 focus:ring-purple-500 px-2 py-1`}>
              {item.lot_num}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Expiry Date</label>
              <p className={`w-full rounded-md ${theme === 'dark' ? 'bg-[#2D1F3F] text-purple-200' : 'bg-gray-50'} border-gray-300 focus:border-purple-500 focus:ring-purple-500 px-2 py-1`}>
              {item.expiry_date ? new Date(item.expiry_date).toISOString().split('T')[0] : ''}
              </p>
            </div>
            
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Remarks</label>
            <p className={`w-full rounded-md ${theme === 'dark' ? 'bg-[#2D1F3F] text-purple-200' : 'bg-gray-50'} border-gray-300 focus:border-purple-500 focus:ring-purple-500 px-2 py-1`}>
            {item.remarks}
              </p>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className={`px-4 py-2 border border-gray-300 rounded-md text-sm font-medium ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}`}
            >
              Close
            </button>
            
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditItemModal;