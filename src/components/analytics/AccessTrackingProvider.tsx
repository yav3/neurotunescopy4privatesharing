import React, { ReactNode } from 'react';
import { useAccessTracking } from '@/hooks/useAccessTracking';

interface AccessTrackingProviderProps {
  children: ReactNode;
}

/**
 * Provider component that enables access tracking for the entire app
 */
export const AccessTrackingProvider: React.FC<AccessTrackingProviderProps> = ({ children }) => {
  useAccessTracking();
  
  return <>{children}</>;
};