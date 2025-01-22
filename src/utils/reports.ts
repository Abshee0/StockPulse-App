import * as XLSX from 'xlsx';
import { supabase } from '../lib/supabase';

interface ReportFilters {
  startDate: string;
  endDate: string;
  category: string;
  location: string;
}

export async function generateExcelReport(filters: ReportFilters) {
  // Fetch data based on filters
  const data = await fetchReportData(filters);
  
  // Create workbook
  const wb = XLSX.utils.book_new();
  
  // Create worksheet
  const ws = XLSX.utils.json_to_sheet(data);
  
  // Add worksheet to workbook
  XLSX.utils.book_append_sheet(wb, ws, 'Inventory Report');
  
  // Generate Excel file
  XLSX.writeFile(wb, `inventory-report-${new Date().toISOString().split('T')[0]}.xlsx`);
}

async function fetchReportData(filters: ReportFilters) {
  const { data } = await supabase
    .from('items')
    .select(`
      *,
      category:categories!fk_items_category(name),
      brand:brands!items_brand_id_fkey(name),
      location:locations!items_location_id_fkey(name)
    `);

  return data || [];
}