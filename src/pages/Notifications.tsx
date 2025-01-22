import React from 'react';
import {ArrowLeft} from 'lucide-react'
import {Link} from 'react-router-dom'
import StockSummary from '../components/dashboard/StockSummary';
import RecentActivity from '../components/dashboard/RecentActivity';
import LowStockAlert from '../components/dashboard/LowStockAlert';
import ExpiringItems from '../components/dashboard/ExpiringItems';
import { useTheme } from '../contexts/ThemeContext';

function Notifications() {
  const { theme } = useTheme();
  
  return (
    <div className="space-y-6 font-display">

      <div className={`flex justify-between items-center w-full ${theme === 'dark' ? 'text-violet-200' : 'text-gray-900'}  font-light`}>
        <Link 
            to='/'
            className='flex-shrink-0'
            >
          <ArrowLeft />
        </Link>
        <h1 className={`${theme === 'dark' ? 'text-violet-200' : 'text-gray-900'} flex-grow text-center text-2xl font-semibold`}>Notifications</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StockSummary />
        <LowStockAlert />
        <ExpiringItems />
        <div className="lg:col-span-3">
          <RecentActivity />
        </div>
      </div>
    </div>
  );
}

export default Notifications;