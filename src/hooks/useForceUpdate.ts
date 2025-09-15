/**
 * Force Render & Update Utilities  
 * Solutions for when UI updates fail to render/show in React apps
 */

import { useState, useCallback, useRef, useEffect } from 'react';

// 1. Force Component Re-render Hook
export const useForceUpdate = () => {
  const [, setTick] = useState(0);
  const update = useCallback(() => {
    setTick(tick => tick + 1);
  }, []);
  return update;
};

// 2. Force Re-render with Key Change
export const useKeyUpdate = () => {
  const [key, setKey] = useState(0);
  const forceUpdate = useCallback(() => {
    setKey(prev => prev + 1);
  }, []);
  return { key, forceUpdate };
};

/**
 * Hook for periodic forced updates
 */
export const usePeriodicUpdate = (interval: number = 1000) => {
  const forceUpdate = useForceUpdate();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const startPeriodicUpdate = useCallback(() => {
    if (intervalRef.current) return;
    intervalRef.current = setInterval(forceUpdate, interval);
  }, [forceUpdate, interval]);

  const stopPeriodicUpdate = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => {
      stopPeriodicUpdate();
    };
  }, [stopPeriodicUpdate]);

  return { startPeriodicUpdate, stopPeriodicUpdate, forceUpdate };
};

/**
 * Hook for conditional force updates based on dependencies
 */
export const useConditionalUpdate = (condition: boolean, deps: React.DependencyList = []) => {
  const forceUpdate = useForceUpdate();

  useEffect(() => {
    if (condition) {
      forceUpdate();
    }
  }, [condition, forceUpdate, ...deps]);

  return forceUpdate;
};

/**
 * Hook that forces update when a ref changes
 */
export const useRefUpdate = <T>(ref: React.RefObject<T>) => {
  const forceUpdate = useForceUpdate();

  useEffect(() => {
    if (ref.current) {
      forceUpdate();
    }
  }, [ref.current, forceUpdate]);

  return forceUpdate;
};