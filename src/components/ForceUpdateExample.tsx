/**
 * Force Update Example Component
 * Demonstrates how to use the force update utilities
 */

import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { RefreshCw, Play, Pause, AlertTriangle } from 'lucide-react';
import { 
  useForceUpdate, 
  useKeyUpdate, 
  usePeriodicUpdate, 
  useConditionalUpdate 
} from '@/hooks/useForceUpdate';
import { useStateManager, createGlobalState } from '@/utils/stateManager';
import { globalCache } from '@/utils/simpleCacheManager';
import { globalDOMUpdater } from '@/utils/domUpdater';
import { toast } from 'sonner';

// Global state example
const exampleGlobalState = createGlobalState({
  counter: 0,
  timestamp: Date.now(),
  isActive: false
});

export const ForceUpdateExample: React.FC = () => {
  // Local state
  const [localCounter, setLocalCounter] = useState(0);
  const [staleData, setStaleData] = useState('Click "Update Cache" to see data');
  
  // Force update hooks
  const forceUpdate = useForceUpdate();
  const { key: componentKey, forceUpdate: keyUpdate } = useKeyUpdate();
  const { startPeriodicUpdate, stopPeriodicUpdate } = usePeriodicUpdate(2000);
  
  // Global state
  const globalState = useStateManager(exampleGlobalState);
  
  // Conditional update when local counter changes
  useConditionalUpdate(localCounter > 5, [localCounter]);
  
  // DOM element ref
  const contentRef = useRef<HTMLDivElement>(null);
  
  // Cache example
  const handleCacheExample = () => {
    const cacheKey = 'example-data';
    
    // Try to get cached data
    let data = globalCache.get(cacheKey);
    
    if (!data) {
      // Simulate API data
      data = `Fresh data at ${new Date().toLocaleTimeString()}`;
      globalCache.set(cacheKey, data, 10000); // Cache for 10 seconds
      toast.success('Data cached for 10 seconds');
    } else {
      toast.info('Data loaded from cache');
    }
    
    setStaleData(data);
  };
  
  // Global state updates
  const updateGlobalState = () => {
    exampleGlobalState.setState({
      counter: globalState.counter + 1,
      timestamp: Date.now(),
      isActive: !globalState.isActive
    });
    toast.success('Global state updated');
  };
  
  // DOM force update example
  const handleDOMForceUpdate = () => {
    if (contentRef.current) {
      globalDOMUpdater.forceElementUpdate(contentRef.current);
      toast.success('DOM element force updated');
    }
  };
  
  // Batch update example
  const handleBatchUpdate = () => {
    globalDOMUpdater.batchUpdate(() => {
      setLocalCounter(prev => prev + 1);
      exampleGlobalState.setState({
        counter: globalState.counter + 2,
        timestamp: Date.now()
      });
    });
    toast.success('Batch update completed');
  };
  
  return (
    <div className="space-y-6">
      <Card className="p-6" key={componentKey}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold">Force Update Demo</h3>
          <Badge variant="outline" className="flex items-center gap-1">
            <AlertTriangle className="w-4 h-4" />
            Dev Tools
          </Badge>
        </div>
        
        {/* Current State Display */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-muted rounded-lg mb-6">
          <div>
            <h4 className="font-semibold mb-2">Local State</h4>
            <p>Counter: {localCounter}</p>
            <p>Cache Data: {staleData}</p>
            <p>Component Key: {componentKey}</p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Global State</h4>
            <p>Counter: {globalState.counter}</p>
            <p>Active: {globalState.isActive ? 'Yes' : 'No'}</p>
            <p>Updated: {new Date(globalState.timestamp).toLocaleTimeString()}</p>
          </div>
        </div>
        
        {/* Force Update Controls */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
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
            onClick={handleDOMForceUpdate}
            variant="outline"
          >
            Force DOM Update
          </Button>
          
          <Button 
            onClick={handleBatchUpdate}
            variant="outline"
          >
            Batch Update
          </Button>
        </div>
        
        {/* State Update Controls */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
          <Button 
            onClick={() => setLocalCounter(prev => prev + 1)}
            variant="secondary"
          >
            Local Counter (+1)
          </Button>
          
          <Button 
            onClick={updateGlobalState}
            variant="secondary"
          >
            Global State
          </Button>
          
          <Button 
            onClick={handleCacheExample}
            variant="secondary"
          >
            Update Cache
          </Button>
          
          <Button 
            onClick={() => globalCache.forceRefresh()}
            variant="secondary"
          >
            Clear Cache
          </Button>
          
          <Button 
            onClick={() => setLocalCounter(0)}
            variant="secondary"
          >
            Reset Counter
          </Button>
          
          <Button 
            onClick={() => {
              exampleGlobalState.reset({ counter: 0, timestamp: Date.now(), isActive: false });
              toast.success('Global state reset');
            }}
            variant="secondary"
          >
            Reset Global
          </Button>
        </div>
        
        {/* Cache Statistics */}
        <div className="p-4 bg-muted rounded-lg mb-4">
          <h4 className="font-semibold mb-2">Cache Stats</h4>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>Total: {globalCache.getStats().total}</div>
            <div>Valid: {globalCache.getStats().valid}</div>
            <div>Expired: {globalCache.getStats().expired}</div>
          </div>
        </div>
        
        {/* DOM ref element for force update demo */}
        <div 
          ref={contentRef} 
          className="p-4 border border-dashed border-muted-foreground rounded-lg text-center text-muted-foreground"
        >
          DOM Element for Force Update Demo
          <br />
          <small>Reference count updates when DOM forced</small>
        </div>
        
        {/* Usage Tips */}
        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <h4 className="font-semibold mb-2 text-blue-800 dark:text-blue-200">Usage Tips:</h4>
          <ul className="text-sm space-y-1 text-blue-700 dark:text-blue-300">
            <li>• Use <code>useForceUpdate()</code> when state updates don't trigger re-renders</li>
            <li>• Use <code>useKeyUpdate()</code> to force child component re-initialization</li>
            <li>• Use <code>useConditionalUpdate()</code> to force updates based on conditions</li>
            <li>• Use cache utilities to prevent stale data issues</li>
            <li>• Use DOM updater for direct DOM manipulations</li>
          </ul>
        </div>
      </Card>
    </div>
  );
};