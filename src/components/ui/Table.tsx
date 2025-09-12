import type { TableColumn } from '@/types';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface TableProps<T> {
  data: T[];
  columns: TableColumn<T>[];
  onSort?: (field: keyof T, direction: 'asc' | 'desc') => void;
  sortField?: keyof T;
  sortDirection?: 'asc' | 'desc';
  loading?: boolean;
  emptyMessage?: string;
  onRowClick?: (item: T) => void;
  className?: string;
}

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
  const handleSort = (field: keyof T) => {
    if (!onSort) return;

    const direction = sortField === field && sortDirection === 'asc' ? 'desc' : 'asc';
    onSort(field, direction);
  };

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
    <div className={`bg-white rounded-lg shadow overflow-hidden flex flex-col ${className}`}>
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
                className={`hover:bg-gray-50 ${onRowClick ? 'cursor-pointer' : ''}`}
                onClick={() => onRowClick?.(item)}>
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
