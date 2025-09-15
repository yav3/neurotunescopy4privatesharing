/**
 * State Management with Forced Updates
 * Advanced state management that ensures UI updates
 */

type StateListener<T> = (state: T) => void;

export class StateManager<T extends Record<string, any>> {
  private state: T;
  private listeners = new Set<StateListener<T>>();
  private updateQueue = new Set<() => void>();
  private isProcessingQueue = false;

  constructor(initialState: T) {
    this.state = { ...initialState };
  }

  /**
   * Set state and notify all listeners
   */
  setState(newState: Partial<T> | ((prevState: T) => Partial<T>)): void {
    const update = typeof newState === 'function' ? newState(this.state) : newState;
    this.state = { ...this.state, ...update };
    this.notifyListeners();
  }

  /**
   * Get current state
   */
  getState(): T {
    return { ...this.state };
  }

  /**
   * Subscribe to state changes
   */
  subscribe(listener: StateListener<T>): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  /**
   * Force update all listeners
   */
  forceUpdate(): void {
    this.notifyListeners();
  }

  /**
   * Batch multiple state updates
   */
  batchUpdate(updateFn: () => void): void {
    this.updateQueue.add(updateFn);
    if (!this.isProcessingQueue) {
      this.processUpdateQueue();
    }
  }

  /**
   * Get specific state property
   */
  getProperty<K extends keyof T>(key: K): T[K] {
    return this.state[key];
  }

  /**
   * Set specific state property
   */
  setProperty<K extends keyof T>(key: K, value: T[K]): void {
    this.setState({ [key]: value } as unknown as Partial<T>);
  }

  /**
   * Reset state to initial values
   */
  reset(initialState: T): void {
    this.state = { ...initialState };
    this.notifyListeners();
  }

  /**
   * Notify all listeners of state change
   */
  private notifyListeners(): void {
    const currentState = { ...this.state };
    this.listeners.forEach(listener => {
      try {
        listener(currentState);
      } catch (error) {
        console.error('State listener error:', error);
      }
    });
  }

  /**
   * Process queued updates
   */
  private async processUpdateQueue(): Promise<void> {
    this.isProcessingQueue = true;

    // Wait for next frame
    await new Promise(resolve => requestAnimationFrame(resolve));

    for (const updateFn of this.updateQueue) {
      try {
        updateFn();
      } catch (error) {
        console.error('Batch update error:', error);
      }
    }

    this.updateQueue.clear();
    this.isProcessingQueue = false;
  }
}

/**
 * React Hook for State Manager
 */
import { useState, useEffect } from 'react';

export const useStateManager = <T extends Record<string, any>>(stateManager: StateManager<T>): T => {
  const [state, setState] = useState(stateManager.getState());

  useEffect(() => {
    const unsubscribe = stateManager.subscribe(setState);
    return unsubscribe;
  }, [stateManager]);

  return state;
};

/**
 * Create a global state manager instance
 */
export const createGlobalState = <T extends Record<string, any>>(initialState: T) => {
  return new StateManager(initialState);
};