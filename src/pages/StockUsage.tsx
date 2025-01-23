import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Calendar, ArrowLeft, UploadCloud } from 'lucide-react';
import { useInventory } from '../hooks/useInventory';
import { InventoryItem } from '../types/inventory';
import { supabase } from '../lib/supabase';
import { useTheme } from '../contexts/ThemeContext';

type Period = 'daily' | 'weekly' | 'monthly';

function StockUsage() {
  const { items, isLoading } = useInventory();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [usageAmount, setUsageAmount] = useState('');
  const [period, setPeriod] = useState<Period>('daily');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const { theme } = useTheme();

  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.ref_num.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleUpdateUsage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem || !usageAmount) return;

    const amount = parseInt(usageAmount);
    if (amount <= 0 || amount > selectedItem.qty_in_stock) return;

    try {
      // Update item stock
      const { error: updateError } = await supabase
        .from('items')
        .update({ 
          qty_in_stock: selectedItem.qty_in_stock - amount 
        })
        .eq('id', selectedItem.id);

      if (updateError) throw updateError;

      // Create stock update record
      const { error: stockUpdateError } = await supabase
        .from('stock_updates')
        .insert({
          item_id: selectedItem.id,
          qty_change: -amount,
          update_type: 'shipped',
          update_date: date,
          remarks: `${period.charAt(0).toUpperCase() + period.slice(1)} usage update`
        });

      if (stockUpdateError) throw stockUpdateError;

      setSelectedItem(null);
      setUsageAmount('');
    } catch (error) {
      console.error('Error updating stock usage:', error);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className={`flex justify-between items-center w-full ${theme === 'dark' ? 'text-violet-200' : 'text-gray-900'}  font-light`}>
        <Link 
            to='/'
            className='flex-shrink-0'
            >
            <ArrowLeft />
          </Link>
        <h1 className={`${theme === 'dark' ? 'text-violet-200' : 'text-gray-900'} flex-grow text-center text-2xl font-semibold`}>
          Stock Usage Update
        </h1>
      </div>
      

      <div className={`${theme === 'dark' ? 'bg-[#1A1025] text-purple-200' : 'bg-white'} p-4 rounded-lg shadow space-y-4`}>
        <div className="flex gap-2 items-center w-full">
          {/* Search Icon */}
          <div className="relative flex items-center justify-center">
            <Search className="h-5 w-5 text-gray-400" />
          </div>

          {/* Search Input */}
          <input
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`pl-2 flex-grow rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 ${theme === 'dark' ? 'bg-[#1A1025] text-purple-200' : 'bg-white'}`}
          />
    
          {/* Dropdown */}
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value as Period)}
            className={`rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 ${theme === 'dark' ? 'bg-[#1A1025] text-purple-200' : 'bg-white'} ml-auto`}
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>
      </div>

      <div className={`${theme === 'dark' ? 'bg-[#1A1025] text-purple-200' : 'bg-white'} shadow rounded-lg overflow-hidden`}>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className={`${theme === 'dark' ? 'bg-[#190a29] text-purple-100' : 'bg-gray-50'}`}>
            <tr>
              <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ref Num</th>
              <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Stock</th>
              <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Update Stock</th>
            </tr>
          </thead>
          <tbody className={`${theme === 'dark' ? 'bg-[#1A1025] text-purple-200 divide-[#2D1F3F]' : 'bg-white divide-gray-200'} divide-y `}>
            {filteredItems.map((item) => (
              <tr key={item.id} className={`${theme === 'dark' ? 'hover:bg-[#2D1F3F]' : 'hover:bg-gray-50'}`}>
                <td className={`px-5 py-4 whitespace-nowrap text-sm ${theme === 'dark' ? 'text-purple-200' : 'text-gray-900'}`}>{item.ref_num}</td>
                <td className={`px-5 py-4 whitespace-nowrap text-sm ${theme === 'dark' ? 'text-purple-200' : 'text-gray-900'}`}>{item.name}</td>
                <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-500">
                  {item.qty_in_stock} {item.unit}
                </td>
                <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-500 items-center justify-center text-center">
                  <button
                    onClick={() => setSelectedItem(item)}
                    className="text-purple-600 hover:text-purple-900"
                    disabled={item.qty_in_stock === 0}
                  >
                    <UploadCloud />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedItem && (
        <div className="fixed inset-0 bg-[#1A1025] bg-opacity-50 flex items-center justify-center">
          <div className={`${theme === 'dark' ? 'bg-[#1A1025] text-purple-200' : 'bg-white'} rounded-lg shadow-xl p-6 w-full max-w-md`}>
            <h2 className="text-lg font-medium mb-4">Update Usage: {selectedItem.name}</h2>
            <form onSubmit={handleUpdateUsage} className="space-y-4">
              <div>
                <label className={`block text-sm font-medium ${theme === 'dark' ? 'text-purple-200' : 'text-gray-700'}`}>
                  Current Stock: {selectedItem.qty_in_stock} {selectedItem.unit}
                </label>
              </div>

              <div>
                <label className={`block text-sm font-medium ${theme === 'dark' ? 'text-purple-200' : 'text-gray-700'}`}>
                  Usage Amount
                </label>
                <input
                  type="number"
                  value={usageAmount}
                  onChange={(e) => setUsageAmount(e.target.value)}
                  min="1"
                  max={selectedItem.qty_in_stock}
                  required
                  className={`mt-1 block w-full rounded-md border-purple-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 ${theme === 'dark' ? 'bg-[#2D1F3F] text-purple-200' : 'bg-white'}`}
                />
              </div>

              <div>
                <label className={`block text-sm font-medium ${theme === 'dark' ? 'text-purple-200' : 'text-gray-700'}`}>
                  Date
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                  className={`mt-1 block w-full rounded-md border-purple-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 ${theme === 'dark' ? 'bg-[#2D1F3F] text-purple-200' : 'bg-white'}`}
                />
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setSelectedItem(null)}
                  className={`px-4 py-2 border border-gray-300 rounded-md text-sm font-medium ${theme === 'dark' ? 'text-purple-200 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-50'}`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700"
                >
                  Update Usage
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default StockUsage;