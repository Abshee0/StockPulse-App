import React, { useState } from 'react';
import {Link} from 'react-router-dom'
import { Download, ArrowLeft } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { supabase } from '../lib/supabase';
import * as XLSX from 'xlsx';

function Reports() {
  const { theme } = useTheme();
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    category: '',
    location: ''
  });

  const handleDownload = async () => {
    // Fetch data from Supabase with explicit relationship names
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

    // Group items by category
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

    // Create workbook with multiple sheets
    const wb = XLSX.utils.book_new();

    // Create a sheet for each category
    Object.entries(itemsByCategory).forEach(([category, items]) => {
      const ws = XLSX.utils.json_to_sheet(items);
      XLSX.utils.book_append_sheet(wb, ws, category);
    });

    // Generate Excel file
    XLSX.writeFile(wb, `inventory-report-${new Date().toISOString().split('T')[0]}.xlsx`);
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div>
            <label className={`block text-sm font-medium ${theme === 'dark' ? 'text-purple-200' : 'text-gray-700'}`}>Start Date</label>
            <input
              type="date"
              value={filters.startDate}
              onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
              className={`mt-1 block w-full rounded-md border-purple-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 h-9 ${theme === 'dark' ? 'bg-[#2D1F3F] text-purple-200' : 'bg-gray-100 text-gray-700'}`}
            />
          </div>
          
          <div>
            <label className={`block text-sm font-medium ${theme === 'dark' ? 'text-purple-200' : 'text-gray-700'}`}>End Date</label>
            <input
              type="date"
              value={filters.endDate}
              onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
              className={`mt-1 block w-full rounded-md border-purple-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 h-9 ${theme === 'dark' ? 'bg-[#2D1F3F] text-purple-200' : 'bg-gray-100 text-gray-700'}`}
            />
          </div>
        </div>

        <button
          onClick={handleDownload}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700"
        >
          <Download className="h-4 w-4 mr-2" />
          Download Report
        </button>
      </div>
    </div>
  );
}

export default Reports;