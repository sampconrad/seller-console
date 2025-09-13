import { SidebarNavigationProps } from '@/types';
import { TrendingUp, Users } from 'lucide-react';
import React from 'react';

const SidebarNavigation: React.FC<SidebarNavigationProps> = ({
  activeTab,
  onTabChange,
  onMobileClose,
}) => {
  const handleTabChange = (tab: 'leads' | 'opportunities') => {
    onTabChange(tab);
    onMobileClose?.();
  };

  return (
    <div className='p-6 space-y-2'>
      <h2 className='text-sm font-medium text-gray-500 uppercase tracking-wide mb-4'>
        Navigation
      </h2>
      <button
        onClick={() => handleTabChange('leads')}
        className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
          activeTab === 'leads'
            ? 'bg-blue-50 text-blue-700 border border-blue-200'
            : 'text-gray-700 hover:bg-gray-50 border border-transparent'
        }`}
      >
        <Users className='w-5 h-5 text-blue-600' />
        <span className='font-medium'>Leads</span>
      </button>
      <button
        onClick={() => handleTabChange('opportunities')}
        className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
          activeTab === 'opportunities'
            ? 'bg-green-50 text-green-700 border border-green-200'
            : 'text-gray-700 hover:bg-gray-50 border border-transparent'
        }`}
      >
        <TrendingUp className='w-5 h-5 text-green-600' />
        <span className='font-medium'>Opportunities</span>
      </button>
    </div>
  );
};

export default SidebarNavigation;
