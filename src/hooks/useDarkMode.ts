import { useState, useEffect, useCallback } from 'react';

export function useDarkMode() {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window === 'undefined') return true;
    
    const saved = localStorage.getItem('darkMode');
    if (saved) return saved === 'dark';
    
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  const setTheme = useCallback((theme: 'light' | 'dark') => {
    // Apply to document element
    document.documentElement.setAttribute('data-theme', theme);
    document.body.setAttribute('data-theme', theme);

    // Update class-based implementations
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
    }

    // Save preference
    localStorage.setItem('darkMode', theme);

    // Dispatch custom event
    window.dispatchEvent(new CustomEvent('themeChanged', { 
      detail: { theme } 
    }));

    setIsDark(theme === 'dark');
  }, []);

  const toggle = useCallback(() => {
    const newTheme = isDark ? 'light' : 'dark';
    setTheme(newTheme);
    return newTheme;
  }, [isDark, setTheme]);

  // Initialize on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('darkMode');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme: 'light' | 'dark' = (savedTheme === 'dark' || savedTheme === 'light') 
      ? savedTheme 
      : (prefersDark ? 'dark' : 'light');
    
    setTheme(initialTheme);

    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      if (!localStorage.getItem('darkMode')) {
        setTheme(e.matches ? 'dark' : 'light');
      }
    };

    mediaQuery.addEventListener('change', handleChange);

    // Listen for theme changes from other components
    const handleThemeChange = (e: CustomEvent) => {
      setIsDark(e.detail.theme === 'dark');
    };

    window.addEventListener('themeChanged', handleThemeChange as EventListener);

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
      window.removeEventListener('themeChanged', handleThemeChange as EventListener);
    };
  }, [setTheme]);

  return { isDark, toggle, setTheme };
}