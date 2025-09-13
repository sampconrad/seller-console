import { useNotifications } from '@/context/NotificationContext';
import type { Notification } from '@/types';
import { AlertTriangle, CheckCircle, Info, X, XCircle } from 'lucide-react';
import React from 'react';

const ToastContent: React.FC<{ notification: Notification }> = ({
  notification,
}) => {
  const { removeNotification } = useNotifications();

  const getIcon = () => {
    switch (notification.type) {
      case 'success':
        return <CheckCircle className='w-5 h-5 text-success-600' />;
      case 'error':
        return <XCircle className='w-5 h-5 text-error-600' />;
      case 'warning':
        return <AlertTriangle className='w-5 h-5 text-warning-600' />;
      case 'info':
        return <Info className='w-5 h-5 text-primary-600' />;
      default:
        return null;
    }
  };

  const getBackgroundColor = () => {
    switch (notification.type) {
      case 'success':
        return 'bg-success-50 border-success-200';
      case 'error':
        return 'bg-error-50 border-error-200';
      case 'warning':
        return 'bg-warning-50 border-warning-200';
      case 'info':
        return 'bg-primary-50 border-primary-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  return (
    <div
      className={`max-w-2xl w-full min-w-96 ${getBackgroundColor()} border rounded-lg shadow-lg pointer-events-auto animate-fade-in`}
      role='alert'
    >
      <div className='p-4'>
        <div className='flex items-start'>
          <div className='flex-shrink-0'>{getIcon()}</div>
          <div className='ml-3 w-0 flex-1'>
            <p className='text-sm font-medium text-gray-900'>
              {notification.title}
            </p>
            <p className='mt-1 text-sm text-gray-500'>{notification.message}</p>
          </div>
          <div className='ml-4 flex-shrink-0 flex'>
            <button
              className='inline-flex text-gray-400 hover:text-gray-600 focus:outline-none focus:text-gray-600 transition-colors'
              onClick={() => removeNotification(notification.id)}
            >
              <X className='w-4 h-4' />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const Toast: React.FC = () => {
  const { notifications } = useNotifications();

  if (notifications.length === 0) return null;

  return (
    <div
      className='fixed top-4 left-1/2 transform -translate-x-1/2 z-50 space-y-2'
      aria-live='polite'
      aria-label='Notifications'
    >
      {notifications.map(notification => (
        <ToastContent key={notification.id} notification={notification} />
      ))}
    </div>
  );
};

export default Toast;
