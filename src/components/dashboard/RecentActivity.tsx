import React from 'react';
import { Clock } from 'lucide-react';
import { useRecentActivity } from '../../hooks/useRecentActivity';
import { useTheme } from '../../contexts/ThemeContext';

function RecentActivity() {
  const { activities } = useRecentActivity();
  const { theme } = useTheme();

  return (
    <div className={`${theme === 'dark' ? 'bg-[#1A1025] text-purple-200' : 'bg-white'} rounded-lg shadow p-6`}>
      <h2 className={`text-lg font-medium ${theme === 'dark' ? 'text-purple-200' : 'text-gray-900'} mb-4`}>Recent Activity</h2>
      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start space-x-3">
            <Clock className={`w-5 h-5 ${theme === 'dark' ? 'text-purple-400' : 'text-gray-400'} flex-shrink-0 mt-0.5`} />
            <div>
              <p className={`text-sm ${theme === 'dark' ? 'text-purple-200' : 'text-gray-900'}`}>{activity.description}</p>
              <p className={`text-xs ${theme === 'dark' ? 'text-purple-300' : 'text-gray-500'}`}>{activity.timestamp}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RecentActivity;