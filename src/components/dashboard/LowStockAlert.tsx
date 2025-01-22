import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { useLowStockItems } from '../../hooks/useLowStockItems';
import { useTheme } from '../../contexts/ThemeContext';

function LowStockAlert() {
  const { items } = useLowStockItems();
  const { theme } = useTheme();

  return (
    <div className={`${theme === 'dark' ? 'bg-[#1A1025] text-purple-200' : 'bg-white'} rounded-lg shadow p-6`}>
      <h2 className={`text-lg font-medium ${theme === 'dark' ? 'text-purple-200' : 'text-gray-900'} mb-4`}>Low Stock Alerts</h2>
      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.id} className="flex items-start space-x-3">
            <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className={`text-sm font-medium ${theme === 'dark' ? 'text-purple-200' : 'text-gray-900'}`}>{item.name}</p>
              <p className={`text-sm ${theme === 'dark' ? 'text-purple-300' : 'text-gray-500'}`}>
                Current stock: {item.qty_in_stock} {item.unit}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default LowStockAlert;