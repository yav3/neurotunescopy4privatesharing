import { vi, expect, it, beforeEach, describe } from 'vitest';
import { useAudioStore } from '../audioStore';

// Mock DOM elements
Object.defineProperty(global, 'document', {
  value: {
    querySelectorAll: vi.fn(() => []),
    getElementById: vi.fn(() => null),
    createElement: vi.fn(() => ({
      id: '',
      preload: '',
      crossOrigin: '',
      style: { display: '' },
      addEventListener: vi.fn(),
    })),
    body: {
      appendChild: vi.fn(),
      contains: vi.fn(() => false),
    },
  },
  writable: true,
});

describe('AudioStore - Queue Management', () => {
  beforeEach(() => {
    // Reset store state
    useAudioStore.setState({
      queue: [],
      index: -1,
      currentTrack: null,
      isLoading: false,
      error: undefined,
    });

    // Mock fetch: first two HEADs 404, third 200
    let count = 0;
    global.fetch = vi.fn(async (_url, init) => {
      if (init?.method === 'HEAD') {
        count++;
        return new Response(null, { 
          status: count < 3 ? 404 : 200, 
          headers: { 
            'content-type': 'audio/mpeg', 
            'accept-ranges': 'bytes' 
          } 
        });
      }
      // Range GET fallback
      if (init?.method === 'GET' && init?.headers?.['Range']) {
        count++;
        return new Response(null, { 
          status: count < 3 ? 404 : 200, 
          headers: { 
            'content-type': 'audio/mpeg', 
            'accept-ranges': 'bytes' 
          } 
        });
      }
      return new Response(null, { 
        status: 200, 
        headers: { 
          'content-type': 'audio/mpeg', 
          'accept-ranges': 'bytes' 
        } 
      });
    }) as any;
  });

  it('skips broken tracks and plays next working', async () => {
    const store = useAudioStore.getState();
    
    await store.setQueue([
      { id: 'bad-1', title: 'Track A', artist: 'Artist A', duration: 180 },
      { id: 'bad-2', title: 'Track B', artist: 'Artist B', duration: 200 },
      { id: 'good-3', title: 'Track C', artist: 'Artist C', duration: 220 },
    ], 0);
    
    const finalState = useAudioStore.getState();
    
    // Should skip to the working track
    expect(finalState.index).toBe(2);
    expect(finalState.currentTrack?.title).toBe('Track C');
    expect(finalState.isLoading).toBe(false);
    expect(finalState.queue).toHaveLength(1); // Broken tracks removed
  });

  it('handles empty queue gracefully', async () => {
    const store = useAudioStore.getState();
    
    await store.setQueue([], 0);
    
    const finalState = useAudioStore.getState();
    expect(finalState.error).toBe("No working tracks found in queue");
    expect(finalState.isLoading).toBe(false);
  });

  it('handles all broken tracks gracefully', async () => {
    // Mock all requests to fail
    global.fetch = vi.fn(async () => new Response(null, { status: 404 })) as any;
    
    const store = useAudioStore.getState();
    
    await store.setQueue([
      { id: 'bad-1', title: 'Track A', artist: 'Artist A', duration: 180 },
      { id: 'bad-2', title: 'Track B', artist: 'Artist B', duration: 200 },
    ], 0);
    
    const finalState = useAudioStore.getState();
    expect(finalState.error).toBe("No working tracks found in queue");
    expect(finalState.isLoading).toBe(false);
    expect(finalState.queue).toHaveLength(0); // All broken tracks removed
  });
});