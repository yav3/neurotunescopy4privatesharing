import { APIInterceptor } from './apiInterceptor';
import { PerformanceMonitor } from './performanceMonitor';
import { AudioValidator } from './audioValidator';

export function initializeDebugging() {
  if (import.meta.env.PROD) return;
  
  console.log('🔧 Initializing debug tools...');
  
  // Initialize API interceptor
  APIInterceptor.init();
  
  // Start performance monitoring
  PerformanceMonitor.startMonitoring();
  
  // Add global error handler
  window.addEventListener('error', (event) => {
    console.error('🚨 Global Error:', event.error);
    if (!(window as any).__DEBUG_ERRORS__) {
      (window as any).__DEBUG_ERRORS__ = [];
    }
    (window as any).__DEBUG_ERRORS__.push(event.error);
  });
  
  // Add unhandled promise rejection handler
  window.addEventListener('unhandledrejection', (event) => {
    console.error('🚨 Unhandled Promise Rejection:', event.reason);
    if (!(window as any).__DEBUG_ERRORS__) {
      (window as any).__DEBUG_ERRORS__ = [];
    }
    (window as any).__DEBUG_ERRORS__.push(new Error(`Unhandled Promise: ${event.reason}`));
  });
  
  // Validate audio system periodically
  const validationInterval = setInterval(() => {
    const validation = AudioValidator.validateAudioSystem();
    if (!validation.isValid) {
      console.error('🚨 Audio system validation failed:', validation.errors);
    }
    if (validation.warnings.length > 0) {
      console.warn('⚠️ Audio system warnings:', validation.warnings);
    }
  }, 10000); // Check every 10 seconds
  
  // Cleanup function
  const cleanup = () => {
    clearInterval(validationInterval);
    PerformanceMonitor.stopMonitoring();
    APIInterceptor.restore();
  };
  
  // Add cleanup to window for manual cleanup if needed
  (window as any).__DEBUG_CLEANUP__ = cleanup;
  
  console.log('✅ Debug tools initialized');
  return cleanup;
}