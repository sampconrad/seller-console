import { useKeyboardNavigation } from '@/hooks/useKeyboardNavigation';
import type { TableProps } from '@/types';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

const Table = <T,>({
  data,
  columns,
  onSort,
  sortField,
  sortDirection,
  loading = false,
  emptyMessage = 'No data available',
  onRowClick,
  className = '',
}: TableProps<T>) => {
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const tableRef = useRef<HTMLDivElement>(null);

  const handleSort = (field: keyof T) => {
    if (!onSort) return;

    const direction = sortField === field && sortDirection === 'asc' ? 'desc' : 'asc';
    onSort(field, direction);
  };

  // Keyboard navigation for table rows
  useKeyboardNavigation({
    onArrowUp: () => {
      if (data.length === 0) return;
      setSelectedIndex((prev) => Math.max(0, prev - 1));
    },
    onArrowDown: () => {
      if (data.length === 0) return;
      setSelectedIndex((prev) => Math.min(data.length - 1, prev + 1));
    },
    onEnter: () => {
      if (selectedIndex >= 0 && selectedIndex < data.length && onRowClick) {
        onRowClick(data[selectedIndex]);
      }
    },
    enabled: data.length > 0 && !!onRowClick,
  });

  // Reset selection when data changes
  useEffect(() => {
    setSelectedIndex(-1);
  }, [data]);

  // Auto-scroll to keep selected row visible
  useEffect(() => {
    if (selectedIndex >= 0 && tableRef.current) {
      const scrollContainer = tableRef.current.querySelector('.flex-1.overflow-auto');
      const tableBody = tableRef.current.querySelector('tbody');

      if (scrollContainer && tableBody) {
        const selectedRow = tableBody.children[selectedIndex] as HTMLElement;
        if (selectedRow) {
          const containerRect = scrollContainer.getBoundingClientRect();
          const rowRect = selectedRow.getBoundingClientRect();

          // Check if row is fully visible
          const isRowFullyVisible =
            rowRect.top >= containerRect.top && rowRect.bottom <= containerRect.bottom;

          if (!isRowFullyVisible) {
            // Calculate scroll position to center the row
            const scrollTop =
              selectedRow.offsetTop -
              scrollContainer.clientHeight / 2 +
              selectedRow.clientHeight / 2;

            scrollContainer.scrollTo({
              top: Math.max(0, scrollTop),
              behavior: 'smooth',
            });
          }
        }
      }
    }
  }, [selectedIndex]);

  const getSortIcon = (field: keyof T) => {
    if (sortField !== field) return null;

    return sortDirection === 'asc' ? (
      <ChevronUp className='w-4 h-4' />
    ) : (
      <ChevronDown className='w-4 h-4' />
    );
  };

  if (loading) {
    return (
      <div className={`bg-white rounded-lg shadow ${className}`}>
        <div className='p-8 text-center'>
          <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto'></div>
          <p className='mt-2 text-gray-500'>Loading...</p>
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className={`bg-white rounded-lg shadow ${className}`}>
        <div className='p-8 text-center'>
          <p className='text-gray-500'>{emptyMessage}</p>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={tableRef}
      className={`bg-white rounded-lg shadow overflow-hidden flex flex-col ${className}`}
      tabIndex={onRowClick ? 0 : undefined}
      role={onRowClick ? 'grid' : undefined}
      aria-label={onRowClick ? 'Data table with keyboard navigation' : undefined}>
      <div className='flex-1 overflow-auto'>
        <table
          className='w-full divide-y divide-gray-200 table-fixed'
          style={{ width: '100%', tableLayout: 'fixed' }}>
          <thead className='bg-gray-100 sticky top-0 z-10'>
            <tr>
              {columns.map((column) => (
                <th
                  key={String(column.key)}
                  className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider overflow-hidden ${
                    column.sortable ? 'cursor-pointer hover:bg-gray-200' : ''
                  }`}
                  style={{ width: column.width, maxWidth: column.width }}
                  onClick={() => column.sortable && handleSort(column.key)}>
                  <div className='flex items-center space-x-1'>
                    <span>{column.label}</span>
                    {column.sortable && getSortIcon(column.key)}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className='bg-white divide-y divide-gray-200'>
            {data.map((item, index) => (
              <tr
                key={index}
                className={`hover:bg-gray-50 ${onRowClick ? 'cursor-pointer' : ''} ${
                  selectedIndex === index ? 'bg-blue-50 ring-2 ring-blue-500' : ''
                }`}
                onClick={() => onRowClick?.(item)}
                role={onRowClick ? 'row' : undefined}
                aria-selected={selectedIndex === index}>
                {columns.map((column) => (
                  <td
                    key={String(column.key)}
                    className='px-6 py-4 text-sm text-gray-900 overflow-hidden'
                    style={{ width: column.width, maxWidth: column.width }}>
                    {column.render
                      ? column.render(item[column.key], item)
                      : String(item[column.key] || '')}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Table;
