/**
 * Example Component Demonstrating Force Update Utilities
 * Shows how to use the force update hooks and fix common UI issues
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { RefreshCw, Play, Pause, AlertCircle, CheckCircle } from 'lucide-react';
import { 
  useForceUpdate, 
  useKeyUpdate, 
  usePeriodicUpdate, 
  useConditionalUpdate,
  useRefUpdate 
} from '@/hooks/useForceUpdate';
import { useStateManager, createGlobalState } from '@/utils/stateManager';
import { useCache } from '@/utils/cacheManager';
import { useUIUpdateDiagnostic } from '@/utils/uiUpdateDiagnostic';
import { useAudioStore } from '@/stores';
import { toast } from 'sonner';

// Global state for demonstration
const globalExampleState = createGlobalState({
  counter: 0,
  lastUpdated: Date.now(),
  isActive: false
});

interface ExampleForceUpdateComponentProps {
  className?: string;
  showDiagnostics?: boolean;
}

export const ExampleForceUpdateComponent: React.FC<ExampleForceUpdateComponentProps> = ({ 
  className,
  showDiagnostics = process.env.NODE_ENV === 'development'
}) => {
  // Regular state
  const [localCounter, setLocalCounter] = useState(0);
  const [timestamp, setTimestamp] = useState(Date.now());
  const [staleData, setStaleData] = useState('Initial data');
  
  // Force update hooks
  const forceUpdate = useForceUpdate();
  const { key: componentKey, forceUpdate: keyUpdate } = useKeyUpdate();
  const { startPeriodicUpdate, stopPeriodicUpdate, forceUpdate: periodicUpdate } = usePeriodicUpdate(2000);
  const contentRef = useRef<HTMLDivElement>(null);
  const refForceUpdate = useRefUpdate(contentRef);
  
  // Global state
  const globalState = useStateManager(globalExampleState);
  
  // Cache utilities
  const cache = useCache();
  
  // Audio store integration (real-world example)
  const { currentTrack, isPlaying, isLoading } = useAudioStore();
  
  // Conditional update when audio changes
  useConditionalUpdate(!!currentTrack, [currentTrack?.id]);
  
  // UI diagnostics (only in development)
  const diagnostic = useUIUpdateDiagnostic(
    'ExampleForceUpdateComponent',
    [localCounter, timestamp, currentTrack?.id, isPlaying],
    { localCounter, globalState, staleData }
  );
  
  // Simulate stale closure issue and fix
  const [closureValue, setClosureValue] = useState(0);
  const staleClosureRef = useRef(closureValue);
  
  useEffect(() => {
    staleClosureRef.current = closureValue;
  }, [closureValue]);
  
  // Example of fixing stale closure with force update
  const handleStaleClosureDemo = useCallback(() => {
    // This would be stale without force update
    console.log('Stale value:', closureValue);
    console.log('Current value:', staleClosureRef.current);
    
    // Force update to ensure fresh render
    forceUpdate();
    toast.success('Fixed stale closure with force update!');
  }, [forceUpdate]); // Note: closureValue intentionally omitted to show stale closure
  
  // Cache example with force refresh
  const handleCacheExample = useCallback(async () => {
    const cacheKey = 'example-data';
    
    // Try to get cached data
    let data = cache.get(cacheKey);
    
    if (!data) {
      // Simulate API call
      data = `Fresh data at ${new Date().toLocaleTimeString()}`;
      cache.set(cacheKey, data, 10000); // Cache for 10 seconds
      toast.info('Data cached');
    } else {
      toast.info('Data from cache');
    }
    
    setStaleData(data);
  }, [cache]);
  
  // Example of global state update
  const updateGlobalState = useCallback(() => {
    globalExampleState.setState({
      counter: globalState.counter + 1,
      lastUpdated: Date.now(),
      isActive: !globalState.isActive
    });
    toast.success('Global state updated');
  }, [globalState.counter, globalState.isActive]);
  
  // Example of batch updates
  const handleBatchUpdate = useCallback(() => {
    globalExampleState.batchUpdate(() => {
      // Multiple state updates batched together
      setLocalCounter(prev => prev + 1);
      setTimestamp(Date.now());
      setClosureValue(prev => prev + 10);
      
      globalExampleState.setState({
        counter: globalState.counter + 5,
        lastUpdated: Date.now()
      });
    });
    
    toast.success('Batch update completed');
  }, [globalState.counter]);
  
  // Audio-related force update example
  const handleAudioStateDemo = useCallback(() => {
    if (currentTrack) {
      toast.success(`Current track: ${currentTrack.title}`);
    } else {
      toast.error('No track playing');
    }
    
    // Force update to ensure UI reflects latest audio state
    forceUpdate();
  }, [currentTrack, forceUpdate]);
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopPeriodicUpdate();
    };
  }, [stopPeriodicUpdate]);
  
  return (
    <Card className={`p-6 space-y-6 ${className}`} key={componentKey}>
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold">Force Update Examples</h3>
        <Badge variant={diagnostic.summary.isHealthy ? 'default' : 'destructive'}>
          {diagnostic.summary.isHealthy ? (
            <><CheckCircle className="w-4 h-4 mr-1" /> Healthy</>
          ) : (
            <><AlertCircle className="w-4 h-4 mr-1" /> Issues</>
          )}
        </Badge>
      </div>
      
      {/* Current State Display */}
      <div className="grid grid-cols-2 gap-4 p-4 bg-muted rounded-lg">
        <div>
          <h4 className="font-semibold mb-2">Local State</h4>
          <p>Counter: {localCounter}</p>
          <p>Timestamp: {new Date(timestamp).toLocaleTimeString()}</p>
          <p>Closure Value: {closureValue}</p>
          <p>Stale Data: {staleData}</p>
        </div>
        <div>
          <h4 className="font-semibold mb-2">Global State</h4>
          <p>Counter: {globalState.counter}</p>
          <p>Active: {globalState.isActive ? 'Yes' : 'No'}</p>
          <p>Updated: {new Date(globalState.lastUpdated).toLocaleTimeString()}</p>
        </div>
      </div>
      
      {/* Audio State Integration */}
      {currentTrack && (
        <div className="p-4 bg-primary/10 rounded-lg">
          <h4 className="font-semibold mb-2">Audio State</h4>
          <p>Track: {currentTrack.title}</p>
          <p>Playing: {isPlaying ? 'Yes' : 'No'}</p>
          <p>Loading: {isLoading ? 'Yes' : 'No'}</p>
        </div>
      )}
      
      {/* Force Update Controls */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        <Button 
          onClick={forceUpdate}
          variant="outline"
          className="flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          Force Re-render
        </Button>
        
        <Button 
          onClick={keyUpdate}
          variant="outline"
          className="flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          Key Update
        </Button>
        
        <Button 
          onClick={startPeriodicUpdate}
          variant="outline"
          className="flex items-center gap-2"
        >
          <Play className="w-4 h-4" />
          Start Periodic
        </Button>
        
        <Button 
          onClick={stopPeriodicUpdate}
          variant="outline"
          className="flex items-center gap-2"
        >
          <Pause className="w-4 h-4" />
          Stop Periodic
        </Button>
        
        <Button 
          onClick={handleStaleClosureDemo}
          variant="outline"
        >
          Fix Stale Closure
        </Button>
        
        <Button 
          onClick={refForceUpdate}
          variant="outline"
        >
          Ref Update
        </Button>
      </div>
      
      {/* State Update Controls */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Button 
          onClick={() => setLocalCounter(prev => prev + 1)}
          variant="secondary"
        >
          Local Counter
        </Button>
        
        <Button 
          onClick={updateGlobalState}
          variant="secondary"
        >
          Global State
        </Button>
        
        <Button 
          onClick={handleBatchUpdate}
          variant="secondary"
        >
          Batch Update
        </Button>
        
        <Button 
          onClick={handleCacheExample}
          variant="secondary"
        >
          Cache Example
        </Button>
      </div>
      
      {/* Audio Integration */}
      <div className="flex gap-3">
        <Button 
          onClick={handleAudioStateDemo}
          variant="secondary"
          disabled={!currentTrack}
        >
          Audio State Demo
        </Button>
        
        <Button 
          onClick={() => setClosureValue(prev => prev + 1)}
          variant="secondary"
        >
          Update Closure Value
        </Button>
      </div>
      
      {/* Cache Statistics */}
      <div className="p-4 bg-muted rounded-lg">
        <h4 className="font-semibold mb-2">Cache Statistics</h4>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>Total Items: {cache.stats.total}</div>
          <div>Valid Items: {cache.stats.valid}</div>
          <div>Expired Items: {cache.stats.expired}</div>
          <div>Cache Version: {cache.stats.version}</div>
        </div>
        <div className="flex gap-2 mt-3">
          <Button 
            onClick={() => cache.forceRefresh()}
            size="sm"
            variant="outline"
          >
            Force Refresh Cache
          </Button>
          <Button 
            onClick={() => cache.invalidate()}
            size="sm" 
            variant="outline"
          >
            Clear Cache
          </Button>
        </div>
      </div>
      
      {/* Diagnostics Panel */}
      {showDiagnostics && (
        <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
          <h4 className="font-semibold mb-2 text-yellow-800 dark:text-yellow-200">
            Component Diagnostics
          </h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>Render Count: {diagnostic.renderCount}</div>
            <div>Render Time: {diagnostic.performance.renderTime.toFixed(2)}ms</div>
            <div>Frequent Renders: {diagnostic.renderFrequency.isFrequentlyRendering ? 'Yes' : 'No'}</div>
            <div>Slow Render: {diagnostic.performance.isSlowRender ? 'Yes' : 'No'}</div>
          </div>
          {diagnostic.summary.issues.length > 0 && (
            <div className="mt-2 text-red-600 dark:text-red-400">
              Issues: {diagnostic.summary.issues.join(', ')}
            </div>
          )}
        </div>
      )}
      
      {/* Hidden ref element for ref update demo */}
      <div ref={contentRef} className="hidden">
        Ref content for demonstration
      </div>
    </Card>
  );
};