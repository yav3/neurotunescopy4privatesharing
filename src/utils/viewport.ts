// Viewport utilities for responsive behavior

/**
 * Fix for mobile viewport height issues
 * Sets CSS custom property --vh for 100vh fallback
 */
export function setViewportHeight() {
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
}

/**
 * Responsive breakpoint detector
 */
export function getBreakpoint(): 'mobile' | 'tablet' | 'desktop' {
  const width = window.innerWidth;
  
  if (width < 768) return 'mobile';
  if (width < 1024) return 'tablet';
  return 'desktop';
}

/**
 * Touch device detector
 */
export function isTouchDevice(): boolean {
  return ('ontouchstart' in window) || 
         (navigator.maxTouchPoints > 0) ||
         // @ts-ignore
         (navigator.msMaxTouchPoints > 0);
}

/**
 * Initialize responsive utilities
 */
export function initResponsive() {
  // Set initial viewport height
  setViewportHeight();
  
  // Update viewport height on resize
  window.addEventListener('resize', setViewportHeight);
  
  // Add device class to body
  if (isTouchDevice()) {
    document.body.classList.add('touch-device');
  } else {
    document.body.classList.add('no-touch');
  }
  
  // Add breakpoint class to body
  const updateBreakpointClass = () => {
    document.body.classList.remove('mobile', 'tablet', 'desktop');
    document.body.classList.add(getBreakpoint());
  };
  
  updateBreakpointClass();
  window.addEventListener('resize', updateBreakpointClass);
}

/**
 * Cleanup responsive utilities
 */
export function cleanupResponsive() {
  window.removeEventListener('resize', setViewportHeight);
}