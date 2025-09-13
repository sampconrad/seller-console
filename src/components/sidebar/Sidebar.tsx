/**
 * Main sidebar component with navigation, filters, and data management
 */

import ImportExportModal from '@/components/modals/ImportExportModal';
import SidebarContent from '@/components/sidebar/SidebarContent';
import SidebarHeader from '@/components/sidebar/SidebarHeader';
import MobileHeader from '@/components/ui/MobileHeader';
import { useSidebar } from '@/hooks/useSidebar';
import { SidebarProps } from '@/types';
import { TrendingUp, Users } from 'lucide-react';
import React from 'react';
import SidebarWrapper from './SidebarWrapper';

const Sidebar: React.FC<SidebarProps> = props => {
  const {
    isImportModalOpen,
    isExportModalOpen,
    isMobileMenuOpen,
    sidebarContentProps,
    handleImportFormatSelect,
    handleExportFormatSelect,
    toggleMobileMenu,
    closeMobileMenu,
    setIsImportModalOpen,
    setIsExportModalOpen,
  } = useSidebar(props);

  return (
    <>
      {/* Mobile Top Header */}
      <MobileHeader
        activeTab={props.activeTab}
        tabs={[
          {
            id: 'leads',
            label: 'Leads',
            icon: <Users className='w-5 h-5' />,
            bgColor: 'bg-blue-50',
            iconColor: 'text-blue-600',
          },
          {
            id: 'opportunities',
            label: 'Opportunities',
            icon: <TrendingUp className='w-5 h-5' />,
            bgColor: 'bg-green-50',
            iconColor: 'text-green-600',
          },
        ]}
        isMobileMenuOpen={isMobileMenuOpen}
        onToggleMobileMenu={toggleMobileMenu}
      />

      {/* Mobile Sidebar */}
      <SidebarWrapper
        variant='mobile'
        isMobileMenuOpen={isMobileMenuOpen}
        onCloseMobileMenu={closeMobileMenu}
      >
        <SidebarHeader variant='mobile' onClose={closeMobileMenu} />
        <SidebarContent
          {...sidebarContentProps}
          onMobileClose={closeMobileMenu}
        />
      </SidebarWrapper>

      {/* Desktop Sidebar */}
      <SidebarWrapper variant='desktop'>
        <SidebarHeader variant='desktop' />
        <SidebarContent {...sidebarContentProps} />
      </SidebarWrapper>

      {/* Modals */}
      <ImportExportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onFormatSelect={handleImportFormatSelect}
        title='Import Leads'
        description='Select the format for importing leads data.'
      />

      <ImportExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        onFormatSelect={handleExportFormatSelect}
        title='Export Leads'
        description='Select the format for exporting leads data.'
      />
    </>
  );
};

export default Sidebar;
