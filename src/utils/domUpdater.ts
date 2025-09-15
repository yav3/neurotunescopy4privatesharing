/**
 * DOM Update Utilities
 * Force DOM element updates and batch processing
 */

export class DOMUpdater {
  private observers = new Map<string, Set<(data?: any) => void>>();
  private updateQueue = new Set<() => void>();
  private isUpdating = false;

  constructor() {
    this.observers = new Map();
    this.updateQueue = new Set();
    this.isUpdating = false;
  }

  /**
   * Force DOM element update by triggering reflow
   */
  forceElementUpdate(element: HTMLElement | null): void {
    if (!element) return;
    
    // Trigger reflow
    element.style.display = 'none';
    element.offsetHeight; // Force reflow
    element.style.display = '';
  }

  /**
   * Batch DOM updates for better performance
   */
  batchUpdate(updateFn: () => void): void {
    this.updateQueue.add(updateFn);
    if (!this.isUpdating) {
      this.processUpdateQueue();
    }
  }

  /**
   * Process all queued updates
   */
  private async processUpdateQueue(): Promise<void> {
    this.isUpdating = true;
    
    await new Promise(resolve => requestAnimationFrame(resolve));
    
    for (const updateFn of this.updateQueue) {
      try {
        updateFn();
      } catch (error) {
        console.error('Update failed:', error);
      }
    }
    
    this.updateQueue.clear();
    this.isUpdating = false;
  }

  /**
   * Observer pattern for data changes
   */
  observe(key: string, callback: (data?: any) => void): () => void {
    if (!this.observers.has(key)) {
      this.observers.set(key, new Set());
    }
    this.observers.get(key)!.add(callback);
    
    return () => {
      const callbacks = this.observers.get(key);
      if (callbacks) {
        callbacks.delete(callback);
      }
    };
  }

  /**
   * Notify observers of data changes
   */
  notify(key: string, data?: any): void {
    if (this.observers.has(key)) {
      this.observers.get(key)!.forEach(callback => {
        this.batchUpdate(() => callback(data));
      });
    }
  }

  /**
   * Clear all observers and queued updates
   */
  cleanup(): void {
    this.observers.clear();
    this.updateQueue.clear();
    this.isUpdating = false;
  }
}

// Global DOM updater instance
export const globalDOMUpdater = new DOMUpdater();