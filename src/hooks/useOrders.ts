import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

interface Order {
  id: string;
  item: {
    name: string;
  };
  item_id: string;
  qty_ordered: number;
  order_placed_date: string;
  order_received_date: string | null;
  status: 'pending' | 'received' | 'cancelled';
}

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  async function fetchOrders() {
    const { data } = await supabase
      .from('orders')
      .select(`
        *,
        item:items(name)
      `)
      .order('order_placed_date', { ascending: false });

    if (data) {
      setOrders(data);
    }
    setIsLoading(false);
  }

  const markOrderAsReceived = async (orderId: string) => {
    try {
      // Get the order details
      const { data: order } = await supabase
        .from('orders')
        .select('*')
        .eq('id', orderId)
        .single();

      if (!order) return;

      // Start a transaction by using RPC
      const { error: updateError } = await supabase.rpc('increment_stock', {
        item_id: order.item_id,
        amount: order.qty_ordered
      });

      if (updateError) throw updateError;

      // Update order status
      const { error: updateOrderError } = await supabase
        .from('orders')
        .update({
          status: 'received',
          order_received_date: new Date().toISOString()
        })
        .eq('id', orderId);

      if (updateOrderError) throw updateOrderError;

      // Create stock update record
      const { error: stockUpdateError } = await supabase
        .from('stock_updates')
        .insert({
          item_id: order.item_id,
          qty_change: order.qty_ordered,
          update_type: 'received',
          remarks: `Order ${order.id} received`
        });

      if (stockUpdateError) throw stockUpdateError;

      // Refresh orders list
      await fetchOrders();
    } catch (error) {
      console.error('Error marking order as received:', error);
      throw error;
    }
  };

  return { orders, isLoading, refetchOrders: fetchOrders, markOrderAsReceived };
}