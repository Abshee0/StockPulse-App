import React from 'react';
import { Clock } from 'lucide-react';
import { useExpiringItems } from '../../hooks/useExpiringItems';
import { useTheme } from '../../contexts/ThemeContext';

function ExpiringItems() {
  const { items } = useExpiringItems();
  const { theme } = useTheme();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const getDaysUntilExpiry = (dateString: string) => {
    const today = new Date();
    const expiryDate = new Date(dateString);
    const diffTime = expiryDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className={`${theme === 'dark' ? 'bg-[#1A1025] text-purple-200' : 'bg-white'} rounded-lg shadow p-6`}>
      <h2 className={`text-lg font-medium ${theme === 'dark' ? 'text-purple-200' : 'text-gray-900'} mb-4`}>
        Expiring Items
      </h2>
      <div className="space-y-4">
        {items.map((item) => {
          const daysUntilExpiry = getDaysUntilExpiry(item.expiry_date);
          return (
            <div key={item.id} className="flex items-start space-x-3">
              <Clock className={`w-5 h-5 ${
                daysUntilExpiry <= 30 ? 'text-red-500' :
                daysUntilExpiry <= 60 ? 'text-orange-500' :
                'text-yellow-500'
              } flex-shrink-0 mt-0.5`} />
              <div>
                <p className={`text-sm font-medium ${theme === 'dark' ? 'text-purple-200' : 'text-gray-900'}`}>
                  {item.name}
                </p>
                <p className={`text-sm ${theme === 'dark' ? 'text-purple-300' : 'text-gray-500'}`}>
                  Expires: {formatDate(item.expiry_date)}
                </p>
                <p className={`text-sm ${theme === 'dark' ? 'text-purple-300' : 'text-gray-500'}`}>
                  Stock: {item.qty_in_stock} {item.unit}
                </p>
              </div>
            </div>
          );
        })}
        {items.length === 0 && (
          <p className={`text-sm ${theme === 'dark' ? 'text-purple-300' : 'text-gray-500'}`}>
            No items expiring within 3 months
          </p>
        )}
      </div>
    </div>
  );
}

export default ExpiringItems;