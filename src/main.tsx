import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from '@/components/auth/AuthProvider'
import App from './App.tsx'
import './index.css'
import { initResponsive } from './utils/viewport'

// Initialize responsive utilities
initResponsive();

// Force hard reload to pick up new .env values
if (typeof window !== 'undefined' && window.location.search.includes('reload=env')) {
  window.location.replace(window.location.pathname);
}

console.log('🚀 Starting NeuroTunes app...')

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
)
