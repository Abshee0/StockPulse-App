import React, { useState } from 'react';
import { useInventory } from '../../hooks/useInventory';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { useCategories } from '../../hooks/useCategories';
import { useBrands } from '../../hooks/useBrands';
import { useLocations } from '../../hooks/useLocations';
import { useTheme } from '../../contexts/ThemeContext'

interface CreateOrderFormProps {
  onClose: () => void;
  onOrderCreated: () => void;
}

function CreateOrderForm({ onClose, onOrderCreated }: CreateOrderFormProps) {
  const { items } = useInventory();
  const { categories } = useCategories();
  const { brands } = useBrands();
  const { locations } = useLocations();
  const { user } = useAuth();
  
  const [isNewItem, setIsNewItem] = useState(false);
  const [selectedItem, setSelectedItem] = useState('');
  const [quantity, setQuantity] = useState('');
  
  // New item fields
  const [itemName, setItemName] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [brandId, setBrandId] = useState('');
  const [locationId, setLocationId] = useState('');
  const [unit, setUnit] = useState('');
  const [refNum, setRefNum] = useState('');

  const { theme } = useTheme();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      let itemId = selectedItem;

      if (isNewItem) {
        // First create the new item
        const { data: newItem, error: itemError } = await supabase
          .from('items')
          .insert([{
            name: itemName,
            ref_num: refNum,
            category_id: categoryId,
            brand_id: brandId,
            location_id: locationId,
            unit,
            qty_in_stock: 0
          }])
          .select()
          .single();

        if (itemError) throw itemError;
        itemId = newItem.id;
      }

      // Create the order
      const { error: orderError } = await supabase
        .from('orders')
        .insert([{
          item_id: itemId,
          qty_ordered: parseInt(quantity),
          created_by: user?.id,
          status: 'pending'
        }]);

      if (orderError) throw orderError;
      
      onOrderCreated();
      onClose();
    } catch (error) {
      console.error('Error creating order:', error);
      // Here you would typically show an error message to the user
    }
  };

  return (
    <div className="fixed inset-0 bg-[#1A1025] bg-opacity-50 flex items-center justify-center">
      <div className={`${theme === 'dark' ? 'bg-[#1A1025] text-purple-200' : 'bg-white'} rounded-lg shadow-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto`}>
        <h2 className="text-lg font-medium mb-4">Create New Order</h2>
        
        <div className="mb-4">
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              checked={isNewItem}
              onChange={(e) => setIsNewItem(e.target.checked)}
              className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
            <span className={`ml-2 text-sm ${theme === 'dark' ? 'text-purple-200' : 'text-gray-700'}`}>Order new item not in inventory</span>
          </label>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {isNewItem ? (
            <>
              <div>
                <label className={`block text-sm font-medium ${theme === 'dark' ? 'text-purple-200' : 'text-gray-700'}`}>Reference Number</label>
                <input
                  type="text"
                  value={refNum}
                  onChange={(e) => setRefNum(e.target.value)}
                  required
                  className={`mt-1 block w-full rounded-md border-purple-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 h-9 ${theme === 'dark' ? 'bg-[#2D1F3F] text-purple-200' : 'bg-gray-100 text-gray-700'}`}
                />
              </div>

              <div>
                <label className={`block text-sm font-medium ${theme === 'dark' ? 'text-purple-200' : 'text-gray-700'}`}>Item Name</label>
                <input
                  type="text"
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                  required
                  className={`mt-1 block w-full rounded-md border-purple-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 h-9 ${theme === 'dark' ? 'bg-[#2D1F3F] text-purple-200' : 'bg-gray-100 text-gray-700'}`}
                />
              </div>

              <div>
                <label className={`block text-sm font-medium ${theme === 'dark' ? 'text-purple-200' : 'text-gray-700'}`}>Category</label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
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
                <label className={`block text-sm font-medium ${theme === 'dark' ? 'text-purple-200' : 'text-gray-700'}`}>Brand</label>
                <select
                  value={brandId}
                  onChange={(e) => setBrandId(e.target.value)}
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
                <label className={`block text-sm font-medium ${theme === 'dark' ? 'text-purple-200' : 'text-gray-700'}`}>Location</label>
                <select
                  value={locationId}
                  onChange={(e) => setLocationId(e.target.value)}
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
                <label className={`block text-sm font-medium ${theme === 'dark' ? 'text-purple-200' : 'text-gray-700'}`}>Unit</label>
                <input
                  type="text"
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  required
                  placeholder="e.g., pieces, kg, liters"
                  className={`mt-1 block w-full rounded-md border-purple-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 h-9 ${theme === 'dark' ? 'bg-[#2D1F3F] text-purple-200' : 'bg-gray-100 text-gray-700'}`}
                />
              </div>
            </>
          ) : (
            <div>
              <label className={`block text-sm font-medium ${theme === 'dark' ? 'text-purple-200' : 'text-gray-700'}`}>Item</label>
              <select
                value={selectedItem}
                onChange={(e) => setSelectedItem(e.target.value)}
                required
                className={`mt-1 block w-full rounded-md border-purple-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 h-9 ${theme === 'dark' ? 'bg-[#2D1F3F] text-purple-200' : 'bg-gray-100 text-gray-700'}`}
              >
                <option value="">Select an item</option>
                {items.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name} - Current Stock: {item.qty_in_stock} {item.unit}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className={`block text-sm font-medium ${theme === 'dark' ? 'text-purple-200' : 'text-gray-700'}`}>Order Quantity</label>
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              required
              className={`mt-1 block w-full rounded-md border-purple-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 h-9 ${theme === 'dark' ? 'bg-[#2D1F3F] text-purple-200' : 'bg-gray-100 text-gray-700'}`}
            />
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className={`px-4 py-2 border border-gray-300 rounded-md text-sm font-medium ${theme === 'dark' ? 'text-purple-200 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-50'}`}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700"
            >
              Create Order
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateOrderForm;