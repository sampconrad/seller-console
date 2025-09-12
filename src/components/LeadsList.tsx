/**
 * Leads list component with search, filter, and sort functionality
 */

import { useDebounce } from '@/hooks/useDebounce';
import { useLeads } from '@/hooks/useLeads';
import type { Lead, TableColumn } from '@/types';
import { formatDate, formatSource, getScoreColor, getStatusColor } from '@/utils/dataTransform';
import { Calendar, Users } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import LeadFormModal from './LeadFormModal';
import Pagination from './Pagination';
import Badge from './ui/Badge';
import Table from './ui/Table';
import Searchbox from './Searchbox';

interface LeadsListProps {
  onLeadSelect: (lead: Lead) => void;
  onNewLeadRef?: React.MutableRefObject<(() => void) | null>;
}

const LeadsList: React.FC<LeadsListProps> = ({ onLeadSelect, onNewLeadRef }) => {
  const { leads, loading, filters, sortConfig, updateSearch, updateSort } = useLeads();

  const [searchValue, setSearchValue] = useState(filters.search);
  const debouncedSearch = useDebounce(searchValue, 300);
  const [isLeadFormModalOpen, setIsLeadFormModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  // Update search filter when debounced value changes (doesn't save to localStorage)
  useEffect(() => {
    updateSearch(debouncedSearch);
  }, [debouncedSearch, updateSearch]);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters.search, filters.status]);

  // Expose new lead functionality to parent
  useEffect(() => {
    if (onNewLeadRef) {
      onNewLeadRef.current = () => setIsLeadFormModalOpen(true);
    }
  }, [onNewLeadRef]);

  // Calculate pagination
  const totalPages = Math.ceil(leads.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedLeads = leads.slice(startIndex, endIndex);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  const handleSearchClear = () => {
    setSearchValue('');
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const columns: TableColumn<Lead>[] = [
    {
      key: 'name',
      label: 'Name',
      sortable: true,
      width: '200px',
      render: (value, lead) => (
        <div className='w-full'>
          <div className='font-medium text-gray-900'>{value}</div>
          <div className='text-sm text-gray-500'>{lead.company}</div>
          <div className='text-xs text-gray-400 font-mono'>#{lead.id}</div>
        </div>
      ),
    },
    {
      key: 'email',
      label: 'Email',
      sortable: true,
      width: '200px',
      render: (value) => (
        <div
          className='truncate'
          title={value as string}>
          {value}
        </div>
      ),
    },
    {
      key: 'source',
      label: 'Source',
      sortable: true,
      width: '150px',
      render: (value) => <div>{formatSource(value as string)}</div>,
    },
    {
      key: 'score',
      label: 'Score',
      sortable: true,
      width: '100px',
      render: (value) => (
        <span className={`font-medium ${getScoreColor(value as number)}`}>{value}%</span>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      width: '150px',
      render: (value) => (
        <Badge
          variant='default'
          className={getStatusColor(value as string)}>
          {(value as string).toUpperCase()}
        </Badge>
      ),
    },
    {
      key: 'createdAt',
      label: 'Created',
      sortable: true,
      width: '150px',
      render: (value) => (
        <div className='flex items-center space-x-1'>
          <Calendar className='w-4 h-4 text-gray-400' />
          <span className='inline'>{formatDate(value as Date)}</span>
        </div>
      ),
    },
  ];

  return (
    <div className='h-full flex flex-col max-w-full'>
      {/* Header - Hidden on mobile, shown on lg+ */}
      <div className='hidden lg:block w-full text-left mb-6'>
        <div className='flex items-center space-x-3 mb-2'>
          <Users className='w-8 h-8 text-blue-600' />
          <h1 className='text-2xl font-bold text-gray-900'>Leads</h1>
        </div>
        <p className='text-base text-gray-600'>Manage and convert your leads into opportunities</p>
      </div>

      <Searchbox
        searchValue={searchValue}
        onSearchChange={handleSearchChange}
        onSearchClear={handleSearchClear}
        searchPlaceholder='Search leads...'
        totalItems={leads.length}
        itemLabel='lead'
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
      />

      {/* Table Container - Takes remaining space */}
      <div className='flex-1 min-h-0 flex flex-col'>
        <div className='flex-1 overflow-hidden'>
          <Table
            data={paginatedLeads}
            columns={columns}
            onSort={(field, direction) => updateSort(field, direction)}
            sortField={sortConfig.field}
            sortDirection={sortConfig.direction}
            loading={loading}
            emptyMessage='No leads found. Try adjusting your filters or import some leads.'
            onRowClick={onLeadSelect}
            className='h-full'
          />
        </div>
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        onPreviousPage={handlePreviousPage}
        onNextPage={handleNextPage}
      />

      <LeadFormModal
        isOpen={isLeadFormModalOpen}
        onClose={() => setIsLeadFormModalOpen(false)}
        mode='create'
      />
    </div>
  );
};

export default LeadsList;
