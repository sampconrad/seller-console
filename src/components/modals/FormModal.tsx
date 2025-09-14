/**
 * Reusable form modal component with common form patterns
 */

import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import { useKeyboardNavigation } from '@/hooks/useKeyboardNavigation';
import React, { ReactNode } from 'react';

export interface FormModalProps {
  isOpen: boolean;
  title: string;
  children: ReactNode;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  submitText: string;
  cancelText?: string;
  isSubmitting?: boolean;
  submitDisabled?: boolean;
  className?: string;
}

const FormModal: React.FC<FormModalProps> = ({
  isOpen,
  title,
  children,
  onSubmit,
  onCancel,
  submitText,
  cancelText = 'Cancel',
  isSubmitting = false,
  submitDisabled = false,
  className = '',
}) => {
  // Keyboard navigation for form
  useKeyboardNavigation({
    onEscape: onCancel,
    onEnter: () => {
      // Submit form when Enter is pressed (but not in input fields)
      if (!isSubmitting && !submitDisabled) {
        onSubmit({ preventDefault: () => {} } as React.FormEvent);
      }
    },
    enabled: isOpen,
  });

  const footer = (
    <div className='p-4 sm:p-6 flex flex-col'>
      <Button
        type='button'
        variant='secondary'
        onClick={onCancel}
        disabled={isSubmitting}
        className='w-full order-2 mt-3'
      >
        {cancelText}
      </Button>
      <Button
        type='button'
        variant='primary'
        onClick={() =>
          onSubmit({ preventDefault: () => {} } as React.FormEvent)
        }
        disabled={isSubmitting || submitDisabled}
        loading={isSubmitting}
        className='w-full order-1'
      >
        {isSubmitting ? 'Saving...' : submitText}
      </Button>
    </div>
  );

  return (
    <Modal isOpen={isOpen} onClose={onCancel} title={title} footer={footer}>
      <form onSubmit={onSubmit} className={`space-y-6 ${className}`}>
        {children}
      </form>
    </Modal>
  );
};

export default FormModal;
