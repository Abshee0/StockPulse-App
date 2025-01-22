import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Settings as SettingsIcon, Users, Tags, Building2, MapPin, ArrowLeft } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext'

function Settings() {
  const { user } = useAuth();
  const { theme } = useTheme();

  const settingsGroups = [
    {
      title: 'Inventory Settings',
      items: [
        { name: 'Categories', icon: Tags, href: '/settings/categories' },
        { name: 'Brands', icon: Building2, href: '/settings/brands' },
        { name: 'Locations', icon: MapPin, href: '/settings/locations' },
      ]
    },
    {
      title: 'User Management',
      items: [
        { name: 'User Roles', icon: Users, href: '/settings/roles' },
      ]
    }
  ];

  return (
    <div className="space-y-6">
      <div className={`flex justify-between items-center w-full ${theme === 'dark' ? 'text-violet-200' : 'text-gray-900'}  font-light`}>
        <Link 
            to='/'
            className='flex-shrink-0'
            >
          <ArrowLeft />
        </Link>
        <h1 className={`${theme === 'dark' ? 'text-violet-200' : 'text-gray-900'} flex-grow text-center text-2xl font-semibold`}>Settings</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {settingsGroups.map((group) => (
          <div key={group.title} className={`${theme === 'dark' ? 'bg-[#1A1025] text-purple-200' : 'bg-white'} rounded-lg shadow p-6`}>
            <h2 className="text-lg font-medium mb-4">{group.title}</h2>
            <div className="space-y-2">
              {group.items.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center p-2  ${theme === 'dark' ? 'hover:bg-[#2D1F3F]' : 'hover:bg-gray-50'} rounded-md group`}
                  >
                    <Icon className={`w-5 h-5 mr-3 text-gray-400  ${theme === 'dark' ? 'group-hover:text-purple-200' : 'group-hover:text-gray-500'}`} />
                    <span className={`text-sm text-gray-500  ${theme === 'dark' ? 'group-hover:text-purple-200' : 'group-hover:text-gray-900'}`}>
                      {item.name}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Settings;