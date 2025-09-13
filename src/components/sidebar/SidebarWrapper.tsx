/**
 * Wrapper component for both mobile and desktop sidebar variants
 */

import { SidebarWrapperProps } from '@/types';
import React from 'react';

const SidebarWrapper: React.FC<SidebarWrapperProps> = ({
  variant,
  children,
  isMobileMenuOpen = false,
  onCloseMobileMenu,
}) => {
  if (variant === 'mobile') {
    return (
      <div
        className={`lg:hidden fixed inset-0 z-50 transition-opacity duration-300 ${
          isMobileMenuOpen ? 'pointer-events-auto' : 'pointer-events-none'
        }`}
      >
        <div
          className={`fixed inset-0 bg-black transition-opacity duration-300 ${
            isMobileMenuOpen ? 'bg-opacity-50' : 'bg-opacity-0'
          }`}
          onClick={onCloseMobileMenu}
          aria-hidden='true'
        />
        <div
          className={`absolute right-0 top-0 h-full w-80 bg-white shadow-xl flex flex-col transform transition-transform duration-300 ${
            isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
          onClick={e => e.stopPropagation()}
        >
          {children}
        </div>
      </div>
    );
  }

  return (
    <div className='w-80 bg-white border-r border-gray-200 h-screen sticky top-0 hidden lg:flex flex-col overflow-y-auto'>
      {children}
    </div>
  );
};

export default SidebarWrapper;
