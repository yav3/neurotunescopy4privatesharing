import { useState, useEffect } from 'react';

// Breakpoints matching Tailwind defaults
const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536
} as const;

type Breakpoint = keyof typeof BREAKPOINTS;

export function useResponsive() {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0
  });

  useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isBreakpoint = (breakpoint: Breakpoint) => {
    return windowSize.width >= BREAKPOINTS[breakpoint];
  };

  const isMobile = windowSize.width < BREAKPOINTS.md;
  const isTablet = windowSize.width >= BREAKPOINTS.md && windowSize.width < BREAKPOINTS.lg;
  const isDesktop = windowSize.width >= BREAKPOINTS.lg;

  return {
    windowSize,
    isMobile,
    isTablet,
    isDesktop,
    isBreakpoint,
    // Responsive grid utilities
    getGridColumns: () => {
      if (isMobile) return 1;
      if (isTablet) return 2;
      return 3;
    }
  };
}

export function useSwipeNavigation(onSwipeLeft?: () => void, onSwipeRight?: () => void) {
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart({
      x: e.touches[0].clientX,
      y: e.touches[0].clientY
    });
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart) return;

    const touchEnd = {
      x: e.changedTouches[0].clientX,
      y: e.changedTouches[0].clientY
    };

    const diffX = touchStart.x - touchEnd.x;
    const diffY = touchStart.y - touchEnd.y;

    // Only trigger swipe if it's more horizontal than vertical and meets minimum distance
    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
      if (diffX > 0 && onSwipeLeft) {
        onSwipeLeft(); // Swipe left
      } else if (diffX < 0 && onSwipeRight) {
        onSwipeRight(); // Swipe right
      }
    }

    setTouchStart(null);
  };

  return {
    handleTouchStart,
    handleTouchEnd
  };
}