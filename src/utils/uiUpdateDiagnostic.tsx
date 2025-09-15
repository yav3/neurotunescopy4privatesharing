/**
 * UI Update Diagnostic Utilities
 * Identifies and helps fix common UI update issues
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';

/**
 * Diagnostic hook to detect stale closures and missing dependencies
 */
export const useStaleClosureDiagnostic = (dependencies: any[], name?: string) => {
  const prevDeps = useRef(dependencies);
  const renderCount = useRef(0);
  
  useEffect(() => {
    renderCount.current++;
    
    // Check if dependencies changed
    const hasChanged = dependencies.some((dep, index) => 
      dep !== prevDeps.current[index]
    );
    
    if (hasChanged && name) {
      console.log(`🔄 ${name} dependencies changed:`, {
        old: prevDeps.current,
        new: dependencies,
        renderCount: renderCount.current
      });
    }
    
    prevDeps.current = dependencies;
  });
  
  return renderCount.current;
};

/**
 * Hook to detect components that re-render too frequently
 */
export const useRenderFrequencyDiagnostic = (componentName: string, threshold = 10) => {
  const renderCount = useRef(0);
  const startTime = useRef(Date.now());
  const [isFrequentlyRendering, setIsFrequentlyRendering] = useState(false);
  
  useEffect(() => {
    renderCount.current++;
    const elapsed = Date.now() - startTime.current;
    const rendersPerSecond = renderCount.current / (elapsed / 1000);
    
    if (rendersPerSecond > threshold) {
      if (!isFrequentlyRendering) {
        console.warn(`⚠️ ${componentName} is rendering frequently:`, {
          renders: renderCount.current,
          elapsed: `${elapsed}ms`,
          rps: rendersPerSecond.toFixed(2)
        });
        setIsFrequentlyRendering(true);
      }
    } else if (isFrequentlyRendering && rendersPerSecond < threshold / 2) {
      setIsFrequentlyRendering(false);
    }
  });
  
  return {
    renderCount: renderCount.current,
    isFrequentlyRendering
  };
};

/**
 * Hook to monitor state updates and detect missing re-renders
 */
export const useStateUpdateDiagnostic = <T>(state: T, stateName: string) => {
  const prevState = useRef(state);
  const updateCount = useRef(0);
  const lastUpdate = useRef(Date.now());
  
  useEffect(() => {
    if (state !== prevState.current) {
      updateCount.current++;
      const now = Date.now();
      const timeSinceLastUpdate = now - lastUpdate.current;
      
      console.log(`📊 ${stateName} updated:`, {
        old: prevState.current,
        new: state,
        updateCount: updateCount.current,
        timeSinceLastUpdate: `${timeSinceLastUpdate}ms`
      });
      
      prevState.current = state;
      lastUpdate.current = now;
    }
  });
  
  return {
    updateCount: updateCount.current,
    hasChanged: state !== prevState.current
  };
};

/**
 * Hook to detect memory leaks in event listeners
 */
export const useEventListenerDiagnostic = () => {
  const listeners = useRef(new Map<string, number>());
  
  const addListener = useCallback((eventName: string, element?: Element | Window) => {
    const target = element || window;
    const current = listeners.current.get(eventName) || 0;
    listeners.current.set(eventName, current + 1);
    
    if (current > 5) {
      console.warn(`⚠️ Multiple listeners for ${eventName}:`, current + 1);
    }
  }, []);
  
  const removeListener = useCallback((eventName: string) => {
    const current = listeners.current.get(eventName) || 0;
    if (current > 0) {
      listeners.current.set(eventName, current - 1);
    }
  }, []);
  
  useEffect(() => {
    return () => {
      // Cleanup diagnostic
      listeners.current.clear();
    };
  }, []);
  
  return { addListener, removeListener, listeners: listeners.current };
};

/**
 * Performance monitoring hook
 */
export const usePerformanceDiagnostic = (componentName: string) => {
  const renderStart = useRef(0);
  const [renderTime, setRenderTime] = useState(0);
  const slowRenderThreshold = 16; // 16ms = 60fps
  
  // Start timing
  renderStart.current = performance.now();
  
  useEffect(() => {
    const renderEnd = performance.now();
    const duration = renderEnd - renderStart.current;
    setRenderTime(duration);
    
    if (duration > slowRenderThreshold) {
      console.warn(`🐌 ${componentName} slow render:`, `${duration.toFixed(2)}ms`);
    }
  });
  
  return {
    renderTime,
    isSlowRender: renderTime > slowRenderThreshold
  };
};

/**
 * Comprehensive diagnostic hook that combines all checks
 */
export const useUIUpdateDiagnostic = (
  componentName: string,
  dependencies: any[] = [],
  state?: any
) => {
  const renderCount = useStaleClosureDiagnostic(dependencies, componentName);
  const renderFreq = useRenderFrequencyDiagnostic(componentName);
  const stateUpdate = state ? useStateUpdateDiagnostic(state, `${componentName}.state`) : null;
  const performance = usePerformanceDiagnostic(componentName);
  const eventDiagnostic = useEventListenerDiagnostic();
  
  return {
    renderCount,
    renderFrequency: renderFreq,
    stateUpdates: stateUpdate,
    performance,
    eventListeners: eventDiagnostic,
    summary: {
      isHealthy: !renderFreq.isFrequentlyRendering && !performance.isSlowRender,
      issues: [
        renderFreq.isFrequentlyRendering && 'Frequent re-renders',
        performance.isSlowRender && 'Slow render performance',
      ].filter(Boolean)
    }
  };
};

/**
 * Debug component that shows diagnostic information
 */
export const UIUpdateDebugPanel = ({ 
  componentName, 
  diagnostic 
}: { 
  componentName: string;
  diagnostic: ReturnType<typeof useUIUpdateDiagnostic>;
}) => {
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }
  
  return (
    <div className="fixed bottom-4 right-4 bg-black/80 text-white p-4 rounded-lg text-xs font-mono z-50 max-w-sm">
      <h4 className="font-bold mb-2">{componentName} Debug</h4>
      <div className="space-y-1">
        <div>Renders: {diagnostic.renderCount}</div>
        <div>Render Time: {diagnostic.performance.renderTime.toFixed(2)}ms</div>
        <div className={diagnostic.renderFrequency.isFrequentlyRendering ? 'text-red-400' : 'text-green-400'}>
          Frequent: {diagnostic.renderFrequency.isFrequentlyRendering ? 'YES' : 'NO'}
        </div>
        {diagnostic.stateUpdates && (
          <div>State Updates: {diagnostic.stateUpdates.updateCount}</div>
        )}
        <div className={diagnostic.summary.isHealthy ? 'text-green-400' : 'text-yellow-400'}>
          Status: {diagnostic.summary.isHealthy ? 'Healthy' : 'Issues Found'}
        </div>
        {diagnostic.summary.issues.length > 0 && (
          <div className="text-red-400">
            Issues: {diagnostic.summary.issues.join(', ')}
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * HOC to automatically add diagnostics to any component
 */
export const withUIUpdateDiagnostic = <P extends object>(
  WrappedComponent: React.ComponentType<P>,
  componentName: string
): React.ComponentType<P> => {
  return React.forwardRef<any, P>((props, ref) => {
    const diagnostic = useUIUpdateDiagnostic(componentName, Object.values(props));
    
    return React.createElement(React.Fragment, null,
      React.createElement(WrappedComponent, { ...props, ref }),
      React.createElement(UIUpdateDebugPanel, { componentName, diagnostic })
    );
  });
};