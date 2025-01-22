import React from 'react';
import { useTheme } from '../../contexts/ThemeContext'

function OrderDetailsModal({ order, onClose, onMarkReceived }) {
    const { theme } = useTheme();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50">
      <div className={`${theme === 'dark' ? 'bg-[#1A1025] text-purple-200' : 'bg-white'} rounded-lg shadow-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto`}>
        <h2 className="text-2xl font-semibold mb-4">Order Item Details</h2>
        <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Name</label>

            <p className={`w-full rounded-md ${theme === 'dark' ? 'bg-[#2D1F3F] text-purple-200' : 'bg-gray-50'} border-gray-300 focus:border-purple-500 focus:ring-purple-500 px-2 py-1`}>
            {order.item.name}
            </p>
        </div>
        <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Qty. Ordered</label>

            <p className={`w-full rounded-md ${theme === 'dark' ? 'bg-[#2D1F3F] text-purple-200' : 'bg-gray-50'} border-gray-300 focus:border-purple-500 focus:ring-purple-500 px-2 py-1`}>
            {order.qty_ordered}
            </p>
          
        </div>
        <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Date Placed</label>

            <p className={`w-full rounded-md ${theme === 'dark' ? 'bg-[#2D1F3F] text-purple-200' : 'bg-gray-50'} border-gray-300 focus:border-purple-500 focus:ring-purple-500 px-2 py-1`}>
            {order.order_placed_date ? new Date(order.order_placed_date).toISOString().split('T')[0] : ''}
            </p>

        </div>
        {order.status === 'received' && (
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Date Received</label>

            <p className={`w-full rounded-md ${theme === 'dark' ? 'bg-[#2D1F3F] text-purple-200' : 'bg-gray-50'} border-gray-300 focus:border-purple-500 focus:ring-purple-500 px-2 py-1`}>
            {order.order_received_date ? new Date(order.order_received_date).toISOString().split('T')[0] : ''}
            </p>
          </div>
        )}
        <div className="mb-4">
            <strong>Status:</strong> {order.status}
            
        </div>
        
        <div className="flex justify-end space-x-3 mt-4">
          <button
            onClick={onClose}
            className={`px-4 py-2 border border-gray-300 rounded-md text-sm font-medium ${theme === 'dark' ? 'text-purple-200 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-50'}`}
          >
            Close
          </button>

          {order.status === 'pending' && (
          <button
            onClick={() => onMarkReceived(order.id, onClose())}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700"
          >
            Mark Received
          </button>
        )}
        </div>
      </div>
    </div>
  );
}

export default OrderDetailsModal;
