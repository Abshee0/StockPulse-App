import React from 'react'
import { useTheme } from '../contexts/ThemeContext';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
    Clock,
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
    X,
    Bell
 } from 'lucide-react';
import logo from '../assets/logo.png'



function Dashboard() {
    const { theme, toggleTheme } = useTheme();
    const { signOut } = useAuth();
    const location = useLocation();
    

    const navigation = [
        { name: 'Notifications', href: '/notifications', icon: Bell },
        { name: 'Inventory', href: '/inventory', icon: Package },
        { name: 'Stock Count', href: '/inventory/stock-count', icon: ClipboardList },
        { name: 'Discard Stock', href: '/inventory/discard', icon: Trash2 },
        { name: 'Orders', href: '/orders', icon: ShoppingCart },
        { name: 'Reports', href: '/reports', icon: FileText },
        { name: 'Users', href: '/users', icon: Users },
        { name: 'Settings', href: '/settings', icon: Settings },
      ];

  return (
    <div className="font-display">
        <div className='flex items-center mt-7 space-x-1 justify-center'>
          <img src={logo} alt="logo" className="h-10 w-11" />
          <h1 className={`${theme === 'dark' ? 'text-violet-400' : 'text-gray-900'}  text-4xl font-medium px-2`}>StockPulse</h1>
        </div>

      <nav className="grid grid-cols-3 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-14">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`${
                        location.pathname === item.href
                          ? theme === 'dark' 
                            ? 'bg-[#2D1F3F] text-purple-200' 
                            : 'bg-violet-100 text-violet-900'
                          : theme === 'dark'
                            ? 'bg-[#2D1F3F] text-purple-200'
                            : ' bg-violet-50 text-violet-900'
                      } group flex items-center px-2 py-2 text-sm font-medium rounded-md`}
                    >
                        <div className='flex flex-col mx-auto items-center p-3'>
                            <Icon className={`${theme === 'dark'? 'text-purple-300' : 'text-[#2D1F3F]'} w-8 h-8`} />
                            <div className='font-semibold mt-3 text-center'>
                                {item.name}
                            </div>
                            
                        </div>
                      
                    </Link>
                  );
                })}
              </nav>

              <div className={`flex-shrink-0 p-4 flex flex-row space-x-10 justify-center mt-10 ${
                      theme === 'dark' ? 'border-[#2D1F3F]' : 'border-gray-200 '
                    }`}>
                      <button
                        onClick={toggleTheme}
                        className={`flex items-center text-sm font-semibold ${
                            theme === 'dark'
                            ? 'bg-[#2D1F3F] text-purple-200'
                            : ' bg-violet-100 text-purple-900'
                        } p-5 rounded-lg`}
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
                        className={`flex items-center text-sm font-semibold ${
                            theme === 'dark'
                            ? 'bg-red-950 text-red-200'
                            : ' bg-red-50 text-red-900'
                        } p-5 rounded-lg`}
                      >
                        <LogOut className="w-6 h-6 mr-3" />
                        Sign out
                      </button>
                </div>
      
      
    </div>
  )
}

export default Dashboard
