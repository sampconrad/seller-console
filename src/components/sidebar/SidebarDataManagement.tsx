import Button from '@/components/ui/Button';
import { SidebarDataManagementProps } from '@/types';
import { Download, FileText, Plus, Upload } from 'lucide-react';
import React, { useState } from 'react';

const SidebarDataManagement: React.FC<SidebarDataManagementProps> = ({
  activeTab,
  onNewLead,
  onImportClick,
  onExportClick,
  onGenerateReport,
  className = '',
}) => {
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);

  const handleGenerateReport = async () => {
    if (!onGenerateReport || isGeneratingReport) return;

    setIsGeneratingReport(true);

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      onGenerateReport();
    } catch (error) {
      console.error('Error generating report:', error);
    } finally {
      setIsGeneratingReport(false);
    }
  };
  return (
    <div className={`space-y-4 ${className}`}>
      <h2 className='text-sm font-medium text-gray-500 uppercase tracking-wide'>
        Data Management
      </h2>

      {activeTab === 'leads' ? (
        <div className='space-y-2'>
          {onGenerateReport && (
            <Button
              variant='primary'
              size='sm'
              onClick={handleGenerateReport}
              loading={isGeneratingReport}
              disabled={isGeneratingReport}
              className='w-full flex items-center justify-center space-x-2 bg-green-600 hover:bg-green-700 text-white'
            >
              {!isGeneratingReport && <FileText className='w-4 h-4 mr-2' />}
              {isGeneratingReport ? 'Generating' : 'Generate Report'}
            </Button>
          )}
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
            Not available for opportunities.
          </div>
        </div>
      )}
    </div>
  );
};

export default SidebarDataManagement;
