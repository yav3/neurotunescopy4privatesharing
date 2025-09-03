import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
// AudioProvider removed - using unified useAudioStore instead
import App from './App.tsx'
import './index.css'

// Force hard reload to pick up new .env values
if (typeof window !== 'undefined' && window.location.search.includes('reload=env')) {
  window.location.replace(window.location.pathname);
}

console.log('🚀 Starting NeuroTunes app...')
console.log('Environment variables:', {
  SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL,
  HAS_ANON_KEY: !!import.meta.env.VITE_SUPABASE_ANON_KEY,
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL
})

// ============= NUCLEAR DEBUGGING SETUP =============

// 1. Intercept ALL HTTP Requests
const originalFetch = window.fetch;
window.fetch = async (...args) => {
  const [url, options] = args;
  console.log('🔵 FETCH REQUEST:', {
    url: url.toString(),
    method: options?.method || 'GET',
    headers: options?.headers,
    body: options?.body,
    timestamp: new Date().toISOString()
  });
  
  try {
    const response = await originalFetch(...args);
    const cloned = response.clone();
    const text = await cloned.text();
    
    console.log('🟢 FETCH RESPONSE:', {
      url: url.toString(),
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries()),
      body: text.substring(0, 500), // First 500 chars
      timestamp: new Date().toISOString()
    });
    
    return response;
  } catch (error) {
    console.log('🔴 FETCH ERROR:', {
      url: url.toString(),
      error: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    });
    throw error;
  }
};

// 2. Debug All Buttons
const debugButtons = () => {
  document.querySelectorAll('button, [role="button"], .btn').forEach((btn, i) => {
    const buttonEl = btn as HTMLButtonElement;
    console.log(`🔘 Button ${i}:`, {
      text: btn.textContent?.trim(),
      id: btn.id,
      className: btn.className,
      onClick: buttonEl.onclick ? 'HAS_ONCLICK' : 'NO_ONCLICK',
      disabled: buttonEl.disabled
    });
    
    // Add click interceptor if not already added
    if (!(btn as HTMLElement).dataset.debugged) {
      (btn as HTMLElement).dataset.debugged = 'true';
      btn.addEventListener('click', (e) => {
        console.log('🔘 BUTTON CLICKED:', {
          button: btn.textContent?.trim(),
          target: e.target,
          currentTarget: e.currentTarget,
          defaultPrevented: e.defaultPrevented,
          timestamp: new Date().toISOString()
        });
      }, true); // Capture phase
    }
  });
};

// 3. API Configuration Debug
const debugAPIConfig = () => {
  const config = {
    NODE_ENV: import.meta.env.NODE_ENV,
    VITE_API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
    window_location: window.location.href,
    origin: window.location.origin
  };
  
  console.log('⚙️ API CONFIG:', config);
};

// 4. Network Monitor
const networkMonitor = {
  start() {
    // Monitor navigator.sendBeacon
    if (navigator.sendBeacon) {
      const originalBeacon = navigator.sendBeacon;
      navigator.sendBeacon = function(url, data) {
        console.log('📡 BEACON:', url, data);
        return originalBeacon.apply(this, arguments);
      };
    }
  }
};

// Initialize debugging
debugAPIConfig();
networkMonitor.start();

// Run button debugging after DOM loads and on mutations
document.addEventListener('DOMContentLoaded', debugButtons);
const observer = new MutationObserver(() => {
  setTimeout(debugButtons, 100); // Debounce
});
observer.observe(document.body, { childList: true, subtree: true });

// Start observing immediately
setTimeout(debugButtons, 1000);

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
