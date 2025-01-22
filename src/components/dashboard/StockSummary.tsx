import React from 'react';
import { Package, TrendingUp, AlertTriangle } from 'lucide-react';
import { useInventoryStats } from '../../hooks/useInventoryStats';
import { useTheme } from '../../contexts/ThemeContext';

function StockSummary() {
  const { totalItems, totalValue, lowStockItems } = useInventoryStats();
  const { theme } = useTheme();

  return (
    <div className={`${theme === 'dark' ? 'bg-[#1A1025] text-purple-200' : 'bg-white'} rounded-lg shadow p-6`}>
      <h2 className={`text-lg font-medium ${theme === 'dark' ? 'text-purple-200' : 'text-gray-900'} mb-4`}>Stock Summary</h2>
      <div className="space-y-4">
        <div className="flex items-center">
          <Package className="w-5 h-5 text-blue-500 mr-3" />
          <div>
            <p className={`text-sm ${theme === 'dark' ? 'text-purple-300' : 'text-gray-500'}`}>Total Items</p>
            <p className="text-xl font-semibold">{totalItems}</p>
          </div>
        </div>
        <div className="flex items-center">
          <TrendingUp className="w-5 h-5 text-green-500 mr-3" />
          <div>
            <p className={`text-sm ${theme === 'dark' ? 'text-purple-300' : 'text-gray-500'}`}>Total Value</p>
            <p className="text-xl font-semibold">${totalValue}</p>
          </div>
        </div>
        <div className="flex items-center">
          <AlertTriangle className="w-5 h-5 text-amber-500 mr-3" />
          <div>
            <p className={`text-sm ${theme === 'dark' ? 'text-purple-300' : 'text-gray-500'}`}>Low Stock Items</p>
            <p className="text-xl font-semibold">{lowStockItems}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StockSummary;