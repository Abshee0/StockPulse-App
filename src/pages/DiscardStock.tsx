import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Search, Trash2, ArrowLeft } from 'lucide-react';
import { useInventory } from '../hooks/useInventory';
import { InventoryItem } from '../types/inventory';
import { supabase } from '../lib/supabase';
import { useTheme } from '../contexts/ThemeContext';

function DiscardStock() {
  const { items, isLoading, refetchItems } = useInventory();
  const [searchTerm, setSearchTerm] = useState('');
  const [discardingItem, setDiscardingItem] = useState<InventoryItem | null>(null);
  const [discardAmount, setDiscardAmount] = useState('');
  const [discardReason, setDiscardReason] = useState('');

  const { theme } = useTheme();

  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.ref_num.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDiscard = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!discardingItem || !discardAmount) return;

    const amount = parseInt(discardAmount);
    if (amount <= 0 || amount > discardingItem.qty_in_stock) return;

    try {
      // Start a transaction
      const { error: updateError } = await supabase
        .from('items')
        .update({ 
          qty_in_stock: discardingItem.qty_in_stock - amount 
        })
        .eq('id', discardingItem.id);

      if (updateError) throw updateError;

      // Create stock update record
      const { error: stockUpdateError } = await supabase
        .from('stock_updates')
        .insert({
          item_id: discardingItem.id,
          qty_change: -amount,
          update_type: 'discarded',
          remarks: discardReason
        });

      if (stockUpdateError) throw stockUpdateError;

      // Refresh the items list
      await refetchItems();
      
      setDiscardingItem(null);
      setDiscardAmount('');
      setDiscardReason('');
    } catch (error) {
      console.error('Error discarding stock:', error);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center w-full">
      <Link 
            to='/'
            className='flex-shrink-0'
            >
          <ArrowLeft className={`${theme === 'dark' ? 'text-violet-200' : 'text-gray-900'}`} />
        </Link>
        <h1 className={`${theme === 'dark' ? 'text-violet-200' : 'text-gray-900'} flex-grow text-center text-2xl font-semibold`}>Discard Stock</h1>
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
            <tr >
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ref Num</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">QTY. In Stock</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody className={`${theme === 'dark' ? 'bg-[#1A1025] text-purple-200 divide-[#2D1F3F]' : 'bg-white divide-gray-200'} divide-y`}>
            {filteredItems.map((item) => (
              <tr key={item.id} className={`${theme === 'dark' ? 'hover:bg-[#2D1F3F] hover:text-purple-200' : 'hover:bg-gray-50'}`}>
                <td className={`px-6 py-4 whitespace-nowrap text-sm ${theme === 'dark' ? 'text-purple-200' : 'text-gray-900'}`}>{item.ref_num}</td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm ${theme === 'dark' ? 'text-purple-200' : 'text-gray-900'}`}>{item.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {item.qty_in_stock} {item.unit}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <button
                    onClick={() => setDiscardingItem(item)}
                    className="text-red-600 hover:text-red-900 flex items-center"
                    disabled={item.qty_in_stock === 0}
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {discardingItem && (
        <div className="fixed inset-0 bg-[#1A1025] bg-opacity-50 flex items-center justify-center">
          <div className={`${theme === 'dark' ? 'bg-[#1A1025] text-purple-200' : 'bg-white'} rounded-lg shadow-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto`}>
            <h2 className="text-lg font-medium mb-4">Discard Stock: {discardingItem.name}</h2>
            <form onSubmit={handleDiscard} className="space-y-4">
              <div>
                <label className={`block text-sm font-medium ${theme === 'dark' ? 'text-purple-400' : 'text-gray-700'}`}>
                  Current Stock: {discardingItem.qty_in_stock} {discardingItem.unit}
                </label>
              </div>

              <div>
                <label className={`ml-2 text-sm ${theme === 'dark' ? 'text-purple-200' : 'text-gray-700'}`}>
                  Amount to Discard
                </label>
                <input
                  type="number"
                  value={discardAmount}
                  onChange={(e) => setDiscardAmount(e.target.value)}
                  min="1"
                  max={discardingItem.qty_in_stock}
                  required
                  className={`mt-1 pl-2 block w-full rounded-md border-purple-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 h-9 ${theme === 'dark' ? 'bg-[#2D1F3F] text-purple-200' : 'bg-gray-100 text-gray-700'}`}
                />
              </div>

              <div>
                <label className={`ml-2 text-sm ${theme === 'dark' ? 'text-purple-200' : 'text-gray-700'}`}>
                  Reason for Discard
                </label>
                <textarea
                  value={discardReason}
                  onChange={(e) => setDiscardReason(e.target.value)}
                  required
                  rows={3}
                  className={`mt-1 pl-2 block w-full rounded-md border-purple-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 ${theme === 'dark' ? 'bg-[#2D1F3F] text-purple-200' : 'bg-gray-100 text-gray-700'}`}
                  placeholder="Enter reason for discarding stock..."
                ></textarea>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setDiscardingItem(null);
                    setDiscardAmount('');
                    setDiscardReason('');
                  }}
                  className={`px-4 py-2 border border-gray-300 rounded-md text-sm font-medium ${theme === 'dark' ? 'text-purple-200 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-50'}`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
                >
                  Discard Stock
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default DiscardStock;