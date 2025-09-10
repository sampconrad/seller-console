import { useNotifications } from '@/context/NotificationContext';
import React from 'react';
import Toast from './Toast';

const ToastContainer: React.FC = () => {
  const { notifications } = useNotifications();

  if (notifications.length === 0) return null;

  return (
    <div
      className='fixed top-4 left-1/2 transform -translate-x-1/2 z-50 space-y-2'
      aria-live='polite'
      aria-label='Notifications'>
      {notifications.map((notification) => (
        <Toast
          key={notification.id}
          notification={notification}
        />
      ))}
    </div>
  );
};

export default ToastContainer;
