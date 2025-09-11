/**
 * Pagination component for table data
 */

import { ChevronLeft, ChevronRight } from 'lucide-react';
import React from 'react';
import Button from './ui/Button';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onPreviousPage: () => void;
  onNextPage: () => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  onPreviousPage,
  onNextPage,
}) => {
  // Calculate display range
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      const startPage = Math.max(1, currentPage - 2);
      const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

      if (startPage > 1) {
        pages.push(1);
        if (startPage > 2) pages.push('...');
      }

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      if (endPage < totalPages) {
        if (endPage < totalPages - 1) pages.push('...');
        pages.push(totalPages);
      }
    }

    return pages;
  };

  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className='bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6'>
      {/* Mobile pagination */}
      <div className='flex-1 flex justify-between sm:hidden'>
        <Button
          variant='secondary'
          onClick={onPreviousPage}
          disabled={currentPage === 1}
          className='relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50'>
          Previous
        </Button>
        <Button
          variant='secondary'
          onClick={onNextPage}
          disabled={currentPage === totalPages}
          className='ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50'>
          Next
        </Button>
      </div>

      {/* Desktop pagination */}
      <div className='hidden sm:flex-1 sm:flex sm:items-center sm:justify-between'>
        <div>
          <p className='text-sm text-gray-700'>
            Showing <span className='font-medium'>{startIndex + 1}</span> to{' '}
            <span className='font-medium'>{Math.min(endIndex, totalItems)}</span> of{' '}
            <span className='font-medium'>{totalItems}</span> results
          </p>
        </div>
        <div>
          <nav
            className='relative z-0 inline-flex rounded-md space-x-1'
            aria-label='Pagination'>
            <Button
              variant='ghost'
              onClick={onPreviousPage}
              disabled={currentPage === 1}
              className='relative inline-flex items-center px-2 py-2 rounded-l-md text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed'>
              <ChevronLeft className='h-5 w-5' />
            </Button>
            {getPageNumbers().map((page, index) => (
              <React.Fragment key={index}>
                {page === '...' ? (
                  <span className='relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700'>
                    ...
                  </span>
                ) : (
                  <Button
                    variant={currentPage === page ? 'primary' : 'ghost'}
                    onClick={() => onPageChange(page as number)}
                    className={`relative inline-flex items-center px-4 py-2 text-sm font-medium ${
                      currentPage === page
                        ? 'z-10 bg-blue-50 text-blue-500 hover:text-white'
                        : 'text-gray-500 hover:bg-gray-50'
                    }`}>
                    {page}
                  </Button>
                )}
              </React.Fragment>
            ))}
            <Button
              variant='ghost'
              onClick={onNextPage}
              disabled={currentPage === totalPages}
              className='relative inline-flex items-center px-2 py-2 rounded-r-md text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed'>
              <ChevronRight className='h-5 w-5' />
            </Button>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Pagination;
