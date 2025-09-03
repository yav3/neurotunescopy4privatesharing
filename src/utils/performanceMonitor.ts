export class PerformanceMonitor {
  private static observers: Map<string, PerformanceObserver> = new Map();
  private static intervals: Set<NodeJS.Timeout> = new Set();
  
  static startMonitoring() {
    // Monitor long tasks
    this.observeLongTasks();
    
    // Monitor memory usage
    this.monitorMemory();
    
    // Monitor audio performance
    this.monitorAudioPerformance();
  }
  
  private static observeLongTasks() {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.duration > 50) {
            console.warn(`⚠️ Long task detected: ${Math.round(entry.duration)}ms`);
          }
        }
      });
      
      try {
        observer.observe({ entryTypes: ['longtask'] });
        this.observers.set('longtask', observer);
      } catch (e) {
        console.log('Long task monitoring not supported');
      }
    }
  }
  
  private static monitorMemory() {
    if ((performance as any).memory) {
      const interval = setInterval(() => {
        const memory = (performance as any).memory;
        const usedMB = Math.round(memory.usedJSHeapSize / 1048576);
        const totalMB = Math.round(memory.totalJSHeapSize / 1048576);
        
        if (usedMB > 100) { // Warning if over 100MB
          console.warn(`⚠️ High memory usage: ${usedMB}MB / ${totalMB}MB`);
        }
      }, 30000); // Check every 30 seconds
      
      this.intervals.add(interval);
    }
  }
  
  private static monitorAudioPerformance() {
    const audioElement = document.getElementById('np-audio') as HTMLAudioElement;
    if (audioElement) {
      audioElement.addEventListener('stalled', () => {
        console.warn('⚠️ Audio stalled');
      });
      
      audioElement.addEventListener('waiting', () => {
        console.warn('⚠️ Audio waiting for data');
      });
      
      audioElement.addEventListener('error', () => {
        console.error('🚨 Audio error:', audioElement.error);
      });
    }
  }
  
  static stopMonitoring() {
    this.observers.forEach(observer => observer.disconnect());
    this.observers.clear();
    
    this.intervals.forEach(interval => clearInterval(interval));
    this.intervals.clear();
  }
}