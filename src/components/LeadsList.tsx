/**
 * Leads list component with search, filter, and sort functionality
 */

import { useDebounce } from '@/hooks/useDebounce';
import { useLeads } from '@/hooks/useLeads';
import type { Lead, TableColumn } from '@/types';
import { LeadStatus } from '@/types';
import { formatDate, getScoreColor, getStatusColor } from '@/utils/dataTransform';
import { ChevronLeft, ChevronRight, Download, Plus, Upload } from 'lucide-react';
import React, { useState } from 'react';
import FormatSelectionModal from './FormatSelectionModal';
import LeadFormModal from './LeadFormModal';
import Badge from './ui/Badge';
import Button from './ui/Button';
import Input from './ui/Input';
import Select from './ui/Select';
import Table from './ui/Table';

interface LeadsListProps {
  onLeadSelect: (lead: Lead) => void;
  onImportClick: (format: 'json' | 'csv') => void;
  onExportClick: (format: 'json' | 'csv') => void;
}

const LeadsList: React.FC<LeadsListProps> = ({ onLeadSelect, onImportClick, onExportClick }) => {
  const { leads, loading, filters, sortConfig, updateFilters, updateSearch, updateSort } =
    useLeads();

  const [searchValue, setSearchValue] = useState(filters.search);
  const debouncedSearch = useDebounce(searchValue, 300);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isLeadFormModalOpen, setIsLeadFormModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  // Update search filter when debounced value changes (doesn't save to localStorage)
  React.useEffect(() => {
    updateSearch(debouncedSearch);
  }, [debouncedSearch, updateSearch]);

  // Reset to first page when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [filters.search, filters.status]);

  // Calculate pagination
  const totalPages = Math.ceil(leads.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedLeads = leads.slice(startIndex, endIndex);

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

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  const handleStatusFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateFilters({ status: e.target.value as LeadStatus | 'all' });
  };

  const handleImportFormatSelect = (format: 'json' | 'csv') => {
    onImportClick(format);
  };

  const handleExportFormatSelect = (format: 'json' | 'csv') => {
    onExportClick(format);
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

  const statusOptions = [
    { value: 'all', label: 'All Statuses' },
    { value: LeadStatus.NEW, label: 'New' },
    { value: LeadStatus.CONTACTED, label: 'Contacted' },
    { value: LeadStatus.QUALIFIED, label: 'Qualified' },
    { value: LeadStatus.UNQUALIFIED, label: 'Unqualified' },
    { value: LeadStatus.CONVERTED, label: 'Converted' },
  ];

  const columns: TableColumn<Lead>[] = [
    {
      key: 'name',
      label: 'Name',
      sortable: true,
      render: (value, lead) => (
        <div>
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
    },
    {
      key: 'source',
      label: 'Source',
      sortable: true,
    },
    {
      key: 'score',
      label: 'Score',
      sortable: true,
      render: (value) => (
        <span className={`font-medium ${getScoreColor(value as number)}`}>{value}%</span>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
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
      render: (value) => formatDate(value as Date),
    },
  ];

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='w-full'>
        <h1 className='text-2xl font-bold text-gray-900'>Leads</h1>
        <p className='text-gray-600'>Manage and convert your leads into opportunities</p>
      </div>

      {/* Action Buttons */}
      <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0 w-full'>
        <div className='flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3'>
          <Button
            variant='secondary'
            onClick={() => setIsImportModalOpen(true)}
            className='w-full sm:w-auto'>
            <Download className='w-4 h-4 mr-2' />
            Import
          </Button>
          <Button
            variant='secondary'
            onClick={() => setIsExportModalOpen(true)}
            disabled={leads.length === 0}
            className='w-full sm:w-auto'>
            <Upload className='w-4 h-4 mr-2' />
            Export
          </Button>
        </div>
        <Button
          variant='primary'
          onClick={() => setIsLeadFormModalOpen(true)}
          className='w-full sm:w-auto'>
          <Plus className='w-4 h-4 mr-2' />
          New Lead
        </Button>
      </div>

      {/* Filters */}
      <div className='bg-white p-4 rounded-lg shadow'>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
          <Input
            placeholder='Search leads...'
            value={searchValue}
            onChange={handleSearchChange}
          />
          <Select
            value={filters.status}
            onChange={handleStatusFilterChange}
            options={statusOptions}
          />
          <div className='text-sm text-gray-500 flex ml-auto mr-2 items-center'>
            {leads.length} lead{leads.length !== 1 ? 's' : ''} found
          </div>
        </div>
      </div>

      {/* Table */}
      <Table
        data={paginatedLeads}
        columns={columns}
        onSort={(field, direction) => updateSort(field, direction)}
        sortField={sortConfig.field}
        sortDirection={sortConfig.direction}
        loading={loading}
        emptyMessage='No leads found. Try adjusting your filters or import some leads.'
        onRowClick={onLeadSelect}
      />

      {/* Pagination */}
      {totalPages > 1 && (
        <div className='bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6'>
          <div className='flex-1 flex justify-between sm:hidden'>
            <Button
              variant='secondary'
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
              className='relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50'>
              Previous
            </Button>
            <Button
              variant='secondary'
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className='ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50'>
              Next
            </Button>
          </div>
          <div className='hidden sm:flex-1 sm:flex sm:items-center sm:justify-between'>
            <div>
              <p className='text-sm text-gray-700'>
                Showing <span className='font-medium'>{startIndex + 1}</span> to{' '}
                <span className='font-medium'>{Math.min(endIndex, leads.length)}</span> of{' '}
                <span className='font-medium'>{leads.length}</span> results
              </p>
            </div>
            <div>
              <nav
                className='relative z-0 inline-flex rounded-md shadow-sm space-x-1'
                aria-label='Pagination'>
                <Button
                  variant='ghost'
                  onClick={handlePreviousPage}
                  disabled={currentPage === 1}
                  className='relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed'>
                  <ChevronLeft className='h-5 w-5' />
                </Button>
                {getPageNumbers().map((page, index) => (
                  <React.Fragment key={index}>
                    {page === '...' ? (
                      <span className='relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700'>
                        ...
                      </span>
                    ) : (
                      <Button
                        variant={currentPage === page ? 'primary' : 'ghost'}
                        onClick={() => handlePageChange(page as number)}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                          currentPage === page
                            ? 'z-10 bg-blue-50 border-blue-500 text-blue-500 hover:text-white'
                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                        }`}>
                        {page}
                      </Button>
                    )}
                  </React.Fragment>
                ))}
                <Button
                  variant='ghost'
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  className='relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed'>
                  <ChevronRight className='h-5 w-5' />
                </Button>
              </nav>
            </div>
          </div>
        </div>
      )}

      {/* Format Selection Modals */}
      <FormatSelectionModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onFormatSelect={handleImportFormatSelect}
        title='Import Leads'
        description='Choose the format for importing leads'
      />

      <FormatSelectionModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        onFormatSelect={handleExportFormatSelect}
        title='Export Leads'
        description='Choose the format for exporting leads'
      />

      {/* Lead Form Modal */}
      <LeadFormModal
        isOpen={isLeadFormModalOpen}
        onClose={() => setIsLeadFormModalOpen(false)}
        mode='create'
      />
    </div>
  );
};

export default LeadsList;
