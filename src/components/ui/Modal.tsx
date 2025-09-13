import { useFocusManagement } from '@/hooks/useFocusManagement';
import { useKeyboardNavigation } from '@/hooks/useKeyboardNavigation';
import type { ModalProps } from '@/types';
import { X } from 'lucide-react';
import React, { useRef } from 'react';

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  'aria-labelledby': ariaLabelledBy,
  'aria-describedby': ariaDescribedBy,
}) => {
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Focus management
  const { containerRef } = useFocusManagement({
    enabled: isOpen,
    trapFocus: true,
    restoreFocus: true,
    initialFocusRef: closeButtonRef,
  });

  // Keyboard navigation
  useKeyboardNavigation({
    onEscape: onClose,
    enabled: isOpen,
  });

  // Handle body scroll lock
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <div
      className={`fixed inset-0 z-50 overflow-y-auto ${
        isOpen ? 'pointer-events-auto' : 'pointer-events-none'
      }`}
    >
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black transition-opacity duration-200 ${
          isOpen ? 'bg-opacity-50' : 'bg-opacity-0'
        }`}
        onClick={onClose}
        aria-hidden='true'
      />

      {/* Modal */}
      <div className='flex h-screen xxs:min-h-full max-h-screen items-stretch xxs:items-center justify-center p-0 xxs:p-4'>
        <div
          ref={containerRef}
          className='relative bg-white rounded-none xxs:rounded-lg shadow-xl max-w-lg w-full h-screen xxs:max-h-[90vh] xxs:h-auto overflow-hidden transform transition-all duration-200 ease-out'
          style={{
            transform: isOpen ? 'scale(1)' : 'scale(0.8)',
            opacity: isOpen ? 1 : 0,
          }}
          role='dialog'
          aria-modal='true'
          aria-labelledby={ariaLabelledBy}
          aria-describedby={ariaDescribedBy}
          tabIndex={-1}
        >
          <div className='h-full flex flex-col'>
            {/* Header */}
            <div className='flex items-center justify-between p-6 border-b border-gray-200 flex-shrink-0'>
              <h3
                id={ariaLabelledBy}
                className='text-lg font-semibold text-gray-900'
              >
                {title}
              </h3>
              <button
                ref={closeButtonRef}
                onClick={onClose}
                className='text-gray-400 hover:text-gray-600 transition-colors'
                aria-label='Close modal'
                type='button'
              >
                <X className='w-6 h-6' aria-hidden='true' />
              </button>
            </div>

            {/* Content */}
            <div className='flex-1 overflow-y-auto p-6 max-h-[calc(100vh-200px)] xxs:max-h-[calc(90vh-200px)]'>
              {children}
            </div>

            {/* Footer */}
            {footer && (
              <div className='flex-shrink-0 border-t border-gray-200 bg-white'>
                {footer}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
