import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Download, ArrowLeft } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { supabase } from '../lib/supabase';
import * as XLSX from 'xlsx';

type ReportType = 'inventory' | 'orders' | 'stockCount' | 'usage' | 'discard';
type DateRange = 'weekly' | 'monthly' | 'custom';

function Reports() {
  const { theme } = useTheme();
  const [reportType, setReportType] = useState<ReportType>('inventory');
  const [dateRange, setDateRange] = useState<DateRange>('weekly');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [specificDate, setSpecificDate] = useState('');

  const handleDownload = async () => {
    const wb = XLSX.utils.book_new();

    switch (reportType) {
      case 'inventory':
        await downloadInventoryReport(wb);
        break;
      case 'orders':
        await downloadOrdersReport(wb);
        break;
      case 'stockCount':
        await downloadStockCountReport(wb);
        break;
      case 'usage':
        await downloadUsageReport(wb);
        break;
      case 'discard':
        await downloadDiscardReport(wb);
        break;
    }
  };

  const downloadInventoryReport = async (wb: XLSX.WorkBook) => {
    const { data: items } = await supabase
      .from('items')
      .select(`
        ref_num,
        name,
        brand:brands!items_brand_id_fkey(name),
        location:locations!items_location_id_fkey(name),
        category:categories!fk_items_category(name),
        qty_in_stock,
        unit,
        pack_size,
        lot_num,
        expiry_date,
        remarks,
        updated_at
      `);

    if (!items) return;

    const itemsByCategory = items.reduce((acc: Record<string, any[]>, item) => {
      const categoryName = item.category.name;
      if (!acc[categoryName]) {
        acc[categoryName] = [];
      }
      acc[categoryName].push({
        'Reference Number': item.ref_num,
        'Item Name': item.name,
        'Brand': item.brand.name,
        'Location': item.location.name,
        'Quantity in Stock': item.qty_in_stock,
        'Unit': item.unit,
        'Pack Size': item.pack_size,
        'Lot Number': item.lot_num,
        'Expiry Date': item.expiry_date,
        'Remarks': item.remarks,
        'Last Updated': new Date(item.updated_at).toLocaleDateString()
      });
      return acc;
    }, {});

    Object.entries(itemsByCategory).forEach(([category, items]) => {
      const ws = XLSX.utils.json_to_sheet(items);
      XLSX.utils.book_append_sheet(wb, ws, category);
    });

    XLSX.writeFile(wb, `inventory-report-${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const downloadOrdersReport = async (wb: XLSX.WorkBook) => {
    let query = supabase
      .from('orders')
      .select(`
        id,
        item:items!inner(
          ref_num,
          name,
          category:categories!fk_items_category(name)
        ),
        qty_ordered,
        order_placed_date,
        order_received_date,
        status
      `);

    if (startDate && endDate) {
      query = query
        .gte('order_placed_date', startDate)
        .lte('order_placed_date', endDate);
    }

    const { data: orders } = await query;
    if (!orders) return;

    const ordersByCategory = orders.reduce((acc: Record<string, any[]>, order) => {
      const categoryName = order.item.category.name;
      if (!acc[categoryName]) {
        acc[categoryName] = [];
      }
      acc[categoryName].push({
        'Reference Number': order.item.ref_num,
        'Item Name': order.item.name,
        'Quantity': order.qty_ordered,
        'Date Placed': new Date(order.order_placed_date).toLocaleDateString(),
        'Date Received': order.order_received_date ? new Date(order.order_received_date).toLocaleDateString() : '-',
        'Status': order.status
      });
      return acc;
    }, {});

    Object.entries(ordersByCategory).forEach(([category, orders]) => {
      const ws = XLSX.utils.json_to_sheet(orders);
      XLSX.utils.book_append_sheet(wb, ws, category);
    });

    XLSX.writeFile(wb, `orders-report-${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const downloadStockCountReport = async (wb: XLSX.WorkBook) => {
    let query = supabase
      .from('stock_updates')
      .select(`
        id,
        item:items!inner(
          ref_num,
          name,
          brand:brands!items_brand_id_fkey(name),
          category:categories!fk_items_category(name),
          lot_num,
          location:locations!items_location_id_fkey(name),
          pack_size,
          unit,
          expiry_date
        ),
        qty_change,
        update_date
      `)
      .eq('update_type', 'adjusted');

    if (dateRange === 'weekly') {
      const lastWeek = new Date();
      lastWeek.setDate(lastWeek.getDate() - 7);
      query = query.gte('update_date', lastWeek.toISOString());
    } else if (dateRange === 'monthly') {
      const lastMonth = new Date();
      lastMonth.setMonth(lastMonth.getMonth() - 1);
      query = query.gte('update_date', lastMonth.toISOString());
    } else if (specificDate) {
      query = query.eq('update_date', specificDate);
    }

    const { data: updates } = await query;
    if (!updates) return;

    const updatesByCategory = updates.reduce((acc: Record<string, any[]>, update) => {
      const categoryName = update.item.category.name;
      if (!acc[categoryName]) {
        acc[categoryName] = [];
      }
      acc[categoryName].push({
        'Reference Number': update.item.ref_num,
        'Brand': update.item.brand.name,
        'Item Name': update.item.name,
        'Lot Number': update.item.lot_num,
        'Location': update.item.location.name,
        'Previous Quantity': update.qty_change,
        'Updated Quantity': update.qty_change,
        'Pack Size': update.item.pack_size,
        'Unit': update.item.unit,
        'Expiry Date': update.item.expiry_date,
        'Stock Updated Date': new Date(update.update_date).toLocaleDateString()
      });
      return acc;
    }, {});

    Object.entries(updatesByCategory).forEach(([category, updates]) => {
      const ws = XLSX.utils.json_to_sheet(updates);
      XLSX.utils.book_append_sheet(wb, ws, category);
    });

    XLSX.writeFile(wb, `stock-count-report-${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const downloadUsageReport = async (wb: XLSX.WorkBook) => {
    let query = supabase
      .from('stock_updates')
      .select(`
        id,
        item:items!inner(
          ref_num,
          name,
          brand:brands!items_brand_id_fkey(name),
          category:categories!fk_items_category(name),
          lot_num,
          location:locations!items_location_id_fkey(name),
          pack_size,
          unit,
          expiry_date
        ),
        qty_change,
        update_date
      `)
      .eq('update_type', 'shipped');

    if (dateRange === 'weekly') {
      const lastWeek = new Date();
      lastWeek.setDate(lastWeek.getDate() - 7);
      query = query.gte('update_date', lastWeek.toISOString());
    } else if (dateRange === 'monthly') {
      const lastMonth = new Date();
      lastMonth.setMonth(lastMonth.getMonth() - 1);
      query = query.gte('update_date', lastMonth.toISOString());
    } else if (specificDate) {
      query = query.eq('update_date', specificDate);
    }

    const { data: updates } = await query;
    if (!updates) return;

    const updatesByCategory = updates.reduce((acc: Record<string, any[]>, update) => {
      const categoryName = update.item.category.name;
      if (!acc[categoryName]) {
        acc[categoryName] = [];
      }
      acc[categoryName].push({
        'Reference Number': update.item.ref_num,
        'Brand': update.item.brand.name,
        'Item Name': update.item.name,
        'Lot Number': update.item.lot_num,
        'Location': update.item.location.name,
        'Previous Quantity': Math.abs(update.qty_change),
        'Updated Quantity': Math.abs(update.qty_change),
        'Pack Size': update.item.pack_size,
        'Unit': update.item.unit,
        'Expiry Date': update.item.expiry_date,
        'Usage Date': new Date(update.update_date).toLocaleDateString()
      });
      return acc;
    }, {});

    Object.entries(updatesByCategory).forEach(([category, updates]) => {
      const ws = XLSX.utils.json_to_sheet(updates);
      XLSX.utils.book_append_sheet(wb, ws, category);
    });

    XLSX.writeFile(wb, `usage-report-${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const downloadDiscardReport = async (wb: XLSX.WorkBook) => {
    let query = supabase
      .from('stock_updates')
      .select(`
        id,
        item:items!inner(
          ref_num,
          name,
          brand:brands!items_brand_id_fkey(name),
          category:categories!fk_items_category(name),
          lot_num,
          location:locations!items_location_id_fkey(name),
          unit
        ),
        qty_change,
        update_date
      `)
      .eq('update_type', 'discarded');

    if (dateRange === 'weekly') {
      const lastWeek = new Date();
      lastWeek.setDate(lastWeek.getDate() - 7);
      query = query.gte('update_date', lastWeek.toISOString());
    } else if (dateRange === 'monthly') {
      const lastMonth = new Date();
      lastMonth.setMonth(lastMonth.getMonth() - 1);
      query = query.gte('update_date', lastMonth.toISOString());
    } else if (specificDate) {
      query = query.eq('update_date', specificDate);
    }

    const { data: updates } = await query;
    if (!updates) return;

    const updatesByCategory = updates.reduce((acc: Record<string, any[]>, update) => {
      const categoryName = update.item.category.name;
      if (!acc[categoryName]) {
        acc[categoryName] = [];
      }
      acc[categoryName].push({
        'Reference Number': update.item.ref_num,
        'Brand': update.item.brand.name,
        'Item Name': update.item.name,
        'Lot Number': update.item.lot_num,
        'Location': update.item.location.name,
        'Quantity': Math.abs(update.qty_change),
        'Unit': update.item.unit,
        'Discard Date': new Date(update.update_date).toLocaleDateString()
      });
      return acc;
    }, {});

    Object.entries(updatesByCategory).forEach(([category, updates]) => {
      const ws = XLSX.utils.json_to_sheet(updates);
      XLSX.utils.book_append_sheet(wb, ws, category);
    });

    XLSX.writeFile(wb, `discard-report-${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  return (
    <div className="space-y-6">
      <div className={`flex justify-between items-center w-full ${theme === 'dark' ? 'text-violet-200' : 'text-gray-900'}  font-light`}>
        <Link 
            to='/'
            className='flex-shrink-0'
            >
          <ArrowLeft />
        </Link>
        <h1 className={`${theme === 'dark' ? 'text-violet-200' : 'text-gray-900'} flex-grow text-center text-2xl font-semibold`}>Reports</h1>
      </div>
      
      <div className={`${theme === 'dark' ? 'text-purple-200 bg-[#1A1025]' : 'text-gray-900 bg-white'} shadow rounded-lg p-6`}>
        <div className="space-y-4">
          <div>
            <label className={`block text-sm font-medium ${theme === 'dark' ? 'text-purple-200' : 'text-gray-700'}`}>Report Type</label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value as ReportType)}
              className={`mt-1 block w-full rounded-md border-purple-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 h-9 ${theme === 'dark' ? 'bg-[#2D1F3F] text-purple-200' : 'bg-gray-100 text-gray-700'}`}
            >
              <option value="inventory">Inventory Report</option>
              <option value="orders">Order Report</option>
              <option value="stockCount">Stock Count Report</option>
              <option value="usage">Usage Report</option>
              <option value="discard">Discard Report</option>
            </select>
          </div>

          {reportType !== 'inventory' && (
            <div>
              <label className={`block text-sm font-medium ${theme === 'dark' ? 'text-purple-200' : 'text-gray-700'}`}>Date Range</label>
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value as DateRange)}
                className={`mt-1 block w-full rounded-md border-purple-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 h-9 ${theme === 'dark' ? 'bg-[#2D1F3F] text-purple-200' : 'bg-gray-100 text-gray-700'}`}
              >
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="custom">Custom Range</option>
              </select>
            </div>
          )}

          {dateRange === 'custom' && reportType === 'orders' && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={`block text-sm font-medium ${theme === 'dark' ? 'text-purple-200' : 'text-gray-700'}`}>Start Date</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className={`mt-1 block w-full rounded-md border-purple-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 h-9 ${theme === 'dark' ? 'bg-[#2D1F3F] text-purple-200' : 'bg-gray-100 text-gray-700'}`}
                />
              </div>
              <div>
                <label className={`block text-sm font-medium ${theme === 'dark' ? 'text-purple-200' : 'text-gray-700'}`}>End Date</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className={`mt-1 block w-full rounded-md border-purple-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 h-9 ${theme === 'dark' ? 'bg-[#2D1F3F] text-purple-200' : 'bg-gray-100 text-gray-700'}`}
                />
              </div>
            </div>
          )}

          {dateRange === 'custom' && reportType !== 'orders' && reportType !== 'inventory' && (
            <div>
              <label className={`block text-sm font-medium ${theme === 'dark' ? 'text-purple-200' : 'text-gray-700'}`}>Specific Date</label>
              <input
                type="date"
                value={specificDate}
                onChange={(e) => setSpecificDate(e.target.value)}
                className={`mt-1 block w-full rounded-md border-purple-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 h-9 ${theme === 'dark' ? 'bg-[#2D1F3F] text-purple-200' : 'bg-gray-100 text-gray-700'}`}
              />
            </div>
          )}

          <button
            onClick={handleDownload}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700"
          >
            <Download className="h-4 w-4 mr-2" />
            Download Report
          </button>
        </div>
      </div>
    </div>
  );
}

export default Reports;