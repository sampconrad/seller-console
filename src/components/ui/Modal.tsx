import type { ModalProps } from '@/types';
import { X } from 'lucide-react';
import React, { useEffect } from 'react';

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 z-50 overflow-y-auto'>
      {/* Overlay */}
      <div
        className='fixed inset-0 bg-black bg-opacity-50 transition-opacity'
        onClick={onClose}
        aria-hidden='true'
      />

      {/* Modal */}
      <div className='flex min-h-full items-center justify-center p-4'>
        <div className='relative bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-hidden'>
          {/* Header */}
          <div className='flex items-center justify-between p-6 border-b border-gray-200'>
            <h3 className='text-lg font-semibold text-gray-900'>{title}</h3>
            <button
              onClick={onClose}
              className='text-gray-400 hover:text-gray-600 transition-colors'
              aria-label='Close modal'>
              <X className='w-6 h-6' />
            </button>
          </div>

          {/* Content */}
          <div className='p-6 overflow-y-auto max-h-[calc(90vh-120px)]'>{children}</div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
