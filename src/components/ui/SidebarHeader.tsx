import { SidebarHeaderProps } from '@/types';
import { CircleDollarSign, X } from 'lucide-react';
import React from 'react';

const SidebarHeader: React.FC<SidebarHeaderProps> = ({ variant, onClose }) => {
  const isMobile = variant === 'mobile';

  return (
    <div
      className={`px-4 py-3 bg-primary-600 flex items-center justify-between flex-shrink-0 relative ${
        isMobile ? 'min-h-fit' : ''
      } ${!isMobile ? 'p-6' : ''} ${!isMobile ? 'overflow-hidden' : ''}`}>
      <div className='absolute left-0 top-0 w-full h-full opacity-10 pointer-events-none'>
        <div
          className={`absolute ${isMobile ? 'left-1 top-8' : 'left-1 top-1/2'} transform ${
            isMobile ? '-translate-y-1/2' : '-translate-y-1/2'
          } -rotate-12`}>
          <CircleDollarSign className={`${isMobile ? 'w-24 h-24' : 'w-28 h-28'} text-white`} />
        </div>
      </div>

      <div className={`relative z-10 flex items-center ${isMobile ? 'space-x-2' : 'space-x-3'}`}>
        <CircleDollarSign
          className={`${isMobile ? 'w-6 h-6' : 'w-8 h-8'} text-yellow-400 drop-shadow-lg`}
        />
        <div className={`flex flex-col ${isMobile ? '-space-y-1' : ''}`}>
          <h1
            className={`${
              isMobile ? 'text-lg' : 'text-2xl'
            } font-bold text-white tracking-wide drop-shadow-lg`}>
            Seller Console
          </h1>
          <p
            className={`${
              isMobile ? 'text-xs' : 'text-md'
            } text-yellow-100 font-medium tracking-wider uppercase`}>
            Lead Management
          </p>
        </div>
      </div>

      {isMobile && onClose && (
        <button
          onClick={onClose}
          className='p-2 rounded-md text-white hover:text-gray-600 hover:bg-gray-100'>
          <X className='w-6 h-6' />
        </button>
      )}
    </div>
  );
};

export default SidebarHeader;
