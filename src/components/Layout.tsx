import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import logo from '../assets/logo.png'
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  FileText, 
  Users,
  Settings,
  LogOut,
  Sun,
  Moon,
  ClipboardList,
  Trash2,
  Menu,
  X
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

function Layout() {
  const { signOut } = useAuth();
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigation = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Inventory', href: '/inventory', icon: Package },
    { name: 'Stock Count', href: '/inventory/stock-count', icon: ClipboardList },
    { name: 'Discard Stock', href: '/inventory/discard', icon: Trash2 },
    { name: 'Orders', href: '/orders', icon: ShoppingCart },
    { name: 'Reports', href: '/reports', icon: FileText },
    { name: 'Users', href: '/users', icon: Users },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  const Sidebar = () => (
    <div className={`flex flex-col flex-grow pt-5 overflow-y-auto border-r ${
      theme === 'dark' ? 'bg-[#1A1025] border-[#2D1F3F]' : 'bg-white border-gray-200'
    }`}>
      <div className="flex flex-col flex-grow ">
        <div className='mx-3 flex items-center mb-2 space-x-1'>
          <img src={logo} alt="logo" className="h-10 w-11" />
          <h1 className={`${theme === 'dark' ? 'text-purple-200' : 'text-gray-900'} text-3xl font-semibold px-2 pb-2`}>StockPulse</h1>
        </div>

        <nav className="flex-1 px-2 pb-4 space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`${
                  location.pathname === item.href
                    ? theme === 'dark' 
                      ? 'bg-[#2D1F3F] text-purple-200' 
                      : 'bg-gray-100 text-gray-900'
                    : theme === 'dark'
                      ? 'text-purple-300 hover:bg-[#2D1F3F] hover:text-purple-200'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                } group flex items-center px-2 py-2 text-sm font-medium rounded-md`}
              >
                <Icon className="w-6 h-6 mr-3" />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>
      <div className={`flex-shrink-0 p-4 border-t ${
        theme === 'dark' ? 'border-[#2D1F3F]' : 'border-gray-200'
      }`}>
        <button
          onClick={toggleTheme}
          className={`flex items-center w-full text-sm font-medium mb-4 ${
            theme === 'dark' ? 'text-purple-300' : 'text-gray-600'
          } hover:text-purple-200`}
        >
          {theme === 'dark' ? (
            <Sun className="w-6 h-6 mr-3" />
          ) : (
            <Moon className="w-6 h-6 mr-3" />
          )}
          {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
        </button>
        <button
          onClick={() => signOut()}
          className={`flex items-center w-full text-sm font-medium ${
            theme === 'dark' ? 'text-purple-300' : 'text-gray-600'
          } hover:text-purple-200`}
        >
          <LogOut className="w-6 h-6 mr-3" />
          Sign out
        </button>
      </div>
    </div>
  );

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'dark bg-[#0F0817]' : 'bg-gray-100'}`}>
      <div className="flex h-screen">
        {/* Desktop Sidebar */}
        <div className="hidden md:flex md:flex-shrink-0">
          <div className="flex flex-col w-64">
            <Sidebar />
          </div>
        </div>

        {/* Mobile Sidebar */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-50 md:hidden">
            <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setIsMobileMenuOpen(false)} />
            <div className="fixed inset-y-0 left-0 flex w-64 flex-col">
              <div className="absolute top-0 right-0 -mr-12 pt-4">
                <button
                  className="p-2 rounded-md text-gray-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              <Sidebar />
            </div>
          </div>
        )}

        {/* Main content */}
        <div className="flex flex-col flex-1 overflow-hidden">
          <main className="flex-1 relative overflow-y-auto focus:outline-none">
            <div className="py-6">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
                <Outlet />
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default Layout;