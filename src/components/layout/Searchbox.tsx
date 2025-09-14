/**
 * Reusable Searchbox component for search and filter functionality
 */

import Input from '@/components/ui/Input';
import { SearchboxProps } from '@/types';
import { Search, X } from 'lucide-react';
import React from 'react';

const Searchbox: React.FC<SearchboxProps> = ({
  searchValue,
  onSearchChange,
  onSearchClear,
  searchPlaceholder = 'Search...',
  totalItems,
  itemLabel,
  className = '',
  currentPage = 1,
  itemsPerPage = 20,
}) => {
  return (
    <div className={`sm:pt-4 ${className}`}>
      <div className='space-y-2 mb-2 sm:space-y-3 sm:mb-3'>
        <Input
          placeholder={searchPlaceholder}
          value={searchValue}
          onChange={onSearchChange}
          leftIcon={<Search className='w-4 h-4 bg-white text-gray-400' />}
          rightIcon={
            searchValue && onSearchClear ? (
              <button
                type='button'
                onClick={onSearchClear}
                className='text-gray-400 hover:text-gray-600 transition-colors'
                title='Clear search'
              >
                <X className='w-4 h-4' />
              </button>
            ) : null
          }
          className='w-full'
        />
        <div className='text-sm text-gray-500 text-right'>
          {currentPage && itemsPerPage ? (
            <>
              Showing{' '}
              <span className='font-medium'>
                {(currentPage - 1) * itemsPerPage + 1}
              </span>{' '}
              to{' '}
              <span className='font-medium'>
                {Math.min(currentPage * itemsPerPage, totalItems)}
              </span>{' '}
              of <span className='font-medium'>{totalItems}</span> results
            </>
          ) : (
            <>
              {totalItems} {itemLabel}
              {totalItems !== 1 ? 's' : ''} found
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Searchbox;
