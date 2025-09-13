import { MobileHeaderProps } from '@/types';
import { Menu, X } from 'lucide-react';
import React from 'react';

const MobileHeader: React.FC<MobileHeaderProps> = ({
  activeTab,
  tabs,
  isMobileMenuOpen,
  onToggleMobileMenu,
  className = '',
}) => {
  const currentTab = tabs.find(tab => tab.id === activeTab);

  return (
    <div
      className={`lg:hidden border-b border-gray-200 px-4 py-3 flex items-center justify-between ${
        currentTab?.bgColor || 'bg-gray-50'
      } ${className}`}
    >
      <div className='flex items-center space-x-2'>
        {currentTab ? (
          <>
            <div className={currentTab.iconColor}>{currentTab.icon}</div>
            <h1 className='text-lg font-semibold text-gray-900'>
              {currentTab.label}
            </h1>
          </>
        ) : (
          <h1 className='text-lg font-semibold text-gray-900'>App</h1>
        )}
      </div>
      <button
        onClick={onToggleMobileMenu}
        className='p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100'
        aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
      >
        {isMobileMenuOpen ? (
          <X className='w-6 h-6' />
        ) : (
          <Menu className='w-6 h-6' />
        )}
      </button>
    </div>
  );
};

export default MobileHeader;
