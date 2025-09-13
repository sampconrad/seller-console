/**
 * Service Container for dependency injection
 * Provides a centralized way to manage and inject services
 */

import React from 'react';
import { apiService } from './api';
import { fileService } from './fileService';
import { storageService } from './storage';

export interface ServiceContainer {
  apiService: typeof apiService;
  fileService: typeof fileService;
  storageService: typeof storageService;
}

class ServiceContainerImpl implements ServiceContainer {
  public apiService = apiService;
  public fileService = fileService;
  public storageService = storageService;
}

// Singleton instance
const serviceContainer = new ServiceContainerImpl();

// Service container context for React
export const ServiceContainerContext = React.createContext<ServiceContainer>(serviceContainer);

// Hook to use services
export const useServices = (): ServiceContainer => {
  const context = React.useContext(ServiceContainerContext);
  if (!context) {
    throw new Error('useServices must be used within a ServiceProvider');
  }
  return context;
};

// Service provider component
export const ServiceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return React.createElement(
    ServiceContainerContext.Provider,
    { value: serviceContainer },
    children
  );
};

export default serviceContainer;
