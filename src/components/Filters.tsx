/**
 * Reusable Filters component for search and filter functionality
 */

import { Filter, Search, X } from 'lucide-react';
import React from 'react';
import Input from './ui/Input';
import Select from './ui/Select';

export interface FilterOption {
  value: string;
  label: string;
}

export interface FiltersProps {
  searchValue: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSearchClear?: () => void;
  searchPlaceholder?: string;
  filterValue: string;
  onFilterChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  filterOptions: FilterOption[];
  totalItems: number;
  itemLabel: string;
  className?: string;
}

const Filters: React.FC<FiltersProps> = ({
  searchValue,
  onSearchChange,
  onSearchClear,
  searchPlaceholder = 'Search...',
  filterValue,
  onFilterChange,
  filterOptions,
  totalItems,
  itemLabel,
  className = '',
}) => {
  return (
    <div className={`bg-white p-4 rounded-lg shadow ${className}`}>
      <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
        <Input
          placeholder={searchPlaceholder}
          value={searchValue}
          onChange={onSearchChange}
          leftIcon={<Search className='w-4 h-4 text-gray-400' />}
          rightIcon={
            searchValue && onSearchClear ? (
              <button
                type="button"
                onClick={onSearchClear}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                title="Clear search"
              >
                <X className='w-4 h-4' />
              </button>
            ) : null
          }
        />
        <Select
          value={filterValue}
          onChange={onFilterChange}
          options={filterOptions}
          leftIcon={<Filter className='w-4 h-4 text-gray-400' />}
        />
        <div className='text-sm text-gray-500 flex ml-auto mr-2 items-center'>
          {totalItems} {itemLabel}{totalItems !== 1 ? 's' : ''} found
        </div>
      </div>
    </div>
  );
};

export default Filters;
