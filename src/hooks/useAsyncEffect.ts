import { useEffect, useRef } from 'react';

// Safe async effect hook that prevents race conditions and memory leaks
export function useAsyncEffect<T>(
  asyncFn: (signal: AbortSignal) => Promise<T>,
  onSuccess: (result: T) => void,
  onError: (error: Error) => void,
  deps: React.DependencyList
) {
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    // Cancel any previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new abort controller for this request
    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    // Execute async function
    asyncFn(abortController.signal)
      .then((result) => {
        // Only call onSuccess if request wasn't aborted
        if (!abortController.signal.aborted) {
          onSuccess(result);
        }
      })
      .catch((error) => {
        // Only call onError if request wasn't aborted and it's not an abort error
        if (!abortController.signal.aborted && error.name !== 'AbortError') {
          onError(error);
        }
      });

    // Cleanup function
    return () => {
      abortController.abort();
    };
  }, deps);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);
}