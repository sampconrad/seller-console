/**
 * Pagination component for table data
 */

import Button from '@/components/ui/Button';
import { PaginationProps } from '@/types';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import React from 'react';

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  onPreviousPage,
  onNextPage,
}) => {
  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = [];

    if (totalPages <= 5) {
      // If total pages is 5 or less, show all pages
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      if (currentPage <= 3) {
        // Near the beginning: 1 2 3 4 5 ... last
        for (let i = 2; i <= 5; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        // Near the end: 1 ... last-4 last-3 last-2 last-1 last
        pages.push('...');
        for (let i = totalPages - 4; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        // In the middle: 1 ... current-1 current current+1 ... last
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      }
    }

    return pages;
  };

  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className='px-4 pt-3 sm:pb-3 flex items-center justify-between border-t border-gray-200 sm:px-6'>
      {/* Mobile pagination */}
      <div className='flex-1 flex justify-between sm:hidden'>
        <Button
          variant='secondary'
          onClick={onPreviousPage}
          disabled={currentPage === 1}
          className='relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50'
        >
          Previous
        </Button>
        <Button
          variant='secondary'
          onClick={onNextPage}
          disabled={currentPage === totalPages}
          className='ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50'
        >
          Next
        </Button>
      </div>

      {/* Desktop pagination */}
      <div className='hidden sm:flex-1 sm:flex sm:items-center sm:justify-center'>
        <div>
          <nav
            className='relative z-0 inline-flex rounded-md space-x-1'
            aria-label='Pagination'
          >
            <Button
              variant='ghost'
              onClick={onPreviousPage}
              disabled={currentPage === 1}
              className='relative inline-flex items-center px-2 py-2 rounded-l-md text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed'
            >
              <ChevronLeft className='h-5 w-5' />
            </Button>
            {getPageNumbers().map((page, index) => (
              <React.Fragment key={index}>
                {page === '...' ? (
                  <span className='relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 w-10 min-w-10 justify-center'>
                    ...
                  </span>
                ) : (
                  <Button
                    variant={currentPage === page ? 'primary' : 'ghost'}
                    onClick={() => onPageChange(page as number)}
                    className={`relative inline-flex items-center px-4 py-2 text-sm font-medium w-10 justify-center min-w-10 ${
                      currentPage === page
                        ? 'z-10 bg-blue-50 text-blue-500 hover:text-white'
                        : 'text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </Button>
                )}
              </React.Fragment>
            ))}
            <Button
              variant='ghost'
              onClick={onNextPage}
              disabled={currentPage === totalPages}
              className='relative inline-flex items-center px-2 py-2 rounded-r-md text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed'
            >
              <ChevronRight className='h-5 w-5' />
            </Button>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Pagination;
