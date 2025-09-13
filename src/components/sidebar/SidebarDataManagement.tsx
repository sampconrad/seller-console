import Button from '@/components/ui/Button';
import { SidebarDataManagementProps } from '@/types';
import { Download, Plus, Upload } from 'lucide-react';
import React from 'react';

const SidebarDataManagement: React.FC<SidebarDataManagementProps> = ({
  activeTab,
  onNewLead,
  onImportClick,
  onExportClick,
  className = '',
}) => {
  return (
    <div className={`space-y-4 ${className}`}>
      <h2 className='text-sm font-medium text-gray-500 uppercase tracking-wide'>
        Data Management
      </h2>

      {activeTab === 'leads' ? (
        <div className='space-y-2'>
          <Button
            variant='primary'
            size='sm'
            onClick={onNewLead}
            className='w-full flex items-center justify-center space-x-2'
          >
            <Plus className='w-4 h-4' />
            <span>New Lead</span>
          </Button>
          <Button
            variant='secondary'
            size='sm'
            onClick={onImportClick}
            className='w-full flex items-center justify-center space-x-2'
          >
            <Download className='w-4 h-4' />
            <span>Import</span>
          </Button>
          <Button
            variant='secondary'
            size='sm'
            onClick={onExportClick}
            className='w-full flex items-center justify-center space-x-2'
          >
            <Upload className='w-4 h-4' />
            <span>Export</span>
          </Button>
        </div>
      ) : (
        <div className='space-y-2'>
          <div className='text-sm text-gray-500 text-center py-4'>
            Import/Export not available for opportunities.
          </div>
        </div>
      )}
    </div>
  );
};

export default SidebarDataManagement;
