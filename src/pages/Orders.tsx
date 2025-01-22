import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Plus, Check, ArrowLeft, Eye } from 'lucide-react';
import { useOrders } from '../hooks/useOrders';
import { supabase } from '../lib/supabase';
import CreateOrderForm from '../components/orders/CreateOrderForm';
import { useTheme } from '../contexts/ThemeContext';
import OrderDetailsModal from '../components/orders/OrderDetailsModal'; // Import the modal component

function Orders() {
  const { orders, isLoading, refetchOrders, markOrderAsReceived } = useOrders();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null); // Track selected order
  const { theme } = useTheme();

  const handleReceiveOrder = async (orderId: string) => {
    try {
      await markOrderAsReceived(orderId);
      onClose();
    } catch (error) {
      console.error('Error receiving order:', error);
    }
  };

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
  };

  const handleCloseModal = () => {
    setSelectedOrder(null);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Link 
          to='/'
          className='flex-shrink-0'
        >
          <ArrowLeft className={`${theme === 'dark' ? 'text-violet-200' : 'text-gray-900'}`} />
        </Link>
        <h1 className={`${theme === 'dark' ? 'text-purple-200' : 'text-gray-900'} text-2xl font-semibold text-gray-900`}>Orders</h1>
        <button
          onClick={() => setShowCreateForm(true)}
          className="flex items-center px-2 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      <div className={`${theme === 'dark' ? 'text-purple-200 bg-[#1A1025]' : 'text-gray-900 bg-white'} shadow rounded-lg overflow-hidden`}>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className={`${theme === 'dark' ? 'bg-[#190a29] text-purple-100' : 'bg-gray-50'}`}>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Qty.</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Ordered</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">View</th>
            </tr>
          </thead>
          <tbody className={`${theme === 'dark' ? 'bg-[#1A1025] text-purple-200 divide-[#2D1F3F]' : 'bg-white divide-gray-200'} divide-y`}>
            {orders.map((order) => (
              <tr key={order.id} className={`${theme === 'dark' ? 'hover:bg-[#2D1F3F]' : 'hover:bg-gray-50'}`}>
                <td className={`px-6 py-4 whitespace-nowrap text-sm ${theme === 'dark' ? 'text-purple-200' : 'text-gray-900'}`}>{order.item.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.qty_ordered}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.order_placed_date ? new Date(order.order_placed_date).toISOString().split('T')[0] : ''}</td>

                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <button
                    onClick={() => handleViewOrder(order)}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    <Eye className='w-5 h-5' />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showCreateForm && (
        <CreateOrderForm
          onClose={() => setShowCreateForm(false)}
          onOrderCreated={refetchOrders}
        />
      )}

      {selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          onClose={handleCloseModal}
          onMarkReceived={handleReceiveOrder}
        />
      )}
    </div>
  );
}

export default Orders;
