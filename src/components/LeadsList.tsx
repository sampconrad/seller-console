/**
 * Leads list component with search, filter, and sort functionality
 */

import { useDebounce } from '@/hooks/useDebounce';
import { useLeads } from '@/hooks/useLeads';
import type { Lead, TableColumn } from '@/types';
import { LeadStatus } from '@/types';
import { formatDate, formatSource, getScoreColor, getStatusColor } from '@/utils/dataTransform';
import { Calendar, Download, Plus, Upload } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import Filters from './Filters';
import FormatSelectionModal from './FormatSelectionModal';
import LeadFormModal from './LeadFormModal';
import Pagination from './Pagination';
import Badge from './ui/Badge';
import Button from './ui/Button';
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
  useEffect(() => {
    updateSearch(debouncedSearch);
  }, [debouncedSearch, updateSearch]);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters.search, filters.status]);

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
      width: '200px',
      render: (value, lead) => (
        <div className='w-full min-w-0'>
          <div
            className='font-medium text-gray-900 truncate'
            title={value as string}>
            {value}
          </div>
          <div
            className='text-sm text-gray-500 truncate'
            title={lead.company}>
            {lead.company}
          </div>
          <div
            className='text-xs text-gray-400 font-mono truncate'
            title={`#${lead.id}`}>
            #{lead.id}
          </div>
        </div>
      ),
    },
    {
      key: 'email',
      label: 'Email',
      sortable: true,
      width: '240px',
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
      width: '140px',
      render: (value) => (
        <div
          className='truncate'
          title={formatSource(value as string)}>
          {formatSource(value as string)}
        </div>
      ),
    },
    {
      key: 'score',
      label: 'Score',
      sortable: true,
      width: '90px',
      render: (value) => (
        <span className={`font-medium ${getScoreColor(value as number)}`}>{value}%</span>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      width: '130px',
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
          <span>{formatDate(value as Date)}</span>
        </div>
      ),
    },
  ];

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='w-full text-center sm:text-left'>
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
            Import Leads
          </Button>
          <Button
            variant='secondary'
            onClick={() => setIsExportModalOpen(true)}
            disabled={leads.length === 0}
            className='w-full sm:w-auto'>
            <Upload className='w-4 h-4 mr-2' />
            Export Leads
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

      <Filters
        searchValue={searchValue}
        onSearchChange={handleSearchChange}
        onSearchClear={handleSearchClear}
        searchPlaceholder='Search leads...'
        filterValue={filters.status}
        onFilterChange={handleStatusFilterChange}
        filterOptions={statusOptions}
        totalItems={leads.length}
        itemLabel='lead'
      />

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

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={leads.length}
        itemsPerPage={itemsPerPage}
        onPageChange={handlePageChange}
        onPreviousPage={handlePreviousPage}
        onNextPage={handleNextPage}
      />

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

      <LeadFormModal
        isOpen={isLeadFormModalOpen}
        onClose={() => setIsLeadFormModalOpen(false)}
        mode='create'
      />
    </div>
  );
};

export default LeadsList;
