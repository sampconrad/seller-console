/**
 * Header component with navigation and branding
 */

import { HeaderProps } from '@/types';
import { Pin } from 'lucide-react';
import React from 'react';

const Header: React.FC<HeaderProps> = ({ activeTab, onTabChange }) => {
  return (
    <header className='sticky top-0 z-50 bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-200'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex justify-between items-center h-16'>
          {/* Logo and Brand */}
          <div className='flex items-center'>
            <Pin className='w-6 h-6 text-primary-600 mr-2' />
            <h1 className='text-md sm:text-xl font-bold text-gray-900'>Seller Console</h1>
          </div>

          {/* Navigation */}
          <nav className='flex space-x-0 sm:space-x-8'>
            <button
              onClick={() => onTabChange('leads')}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'leads'
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-gray-500 hover:text-gray-700'
              }`}>
              Leads
            </button>
            <button
              onClick={() => onTabChange('opportunities')}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'opportunities'
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-gray-500 hover:text-gray-700'
              }`}>
              <span className='hidden sm:inline'>Opportunities</span>
              <span className='sm:hidden'>Opps</span>
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
