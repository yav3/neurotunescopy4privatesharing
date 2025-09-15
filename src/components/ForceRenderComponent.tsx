/**
 * Force Render Component
 * Component that forces updates when triggered
 */

import React, { useEffect } from 'react';
import { useForceUpdate } from '@/hooks/useForceUpdate';

interface ForceRenderComponentProps {
  children: React.ReactNode;
  triggerUpdate: any;
}

export const ForceRenderComponent: React.FC<ForceRenderComponentProps> = ({ 
  children, 
  triggerUpdate 
}) => {
  const forceUpdate = useForceUpdate();
  
  useEffect(() => {
    if (triggerUpdate) {
      forceUpdate();
    }
  }, [triggerUpdate, forceUpdate]);
  
  return <>{children}</>;
};