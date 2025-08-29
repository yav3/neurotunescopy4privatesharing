import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

console.log('🚀 Starting NeuroTunes app...')
console.log('Environment variables:', {
  SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL,
  HAS_ANON_KEY: !!import.meta.env.VITE_SUPABASE_ANON_KEY
})

createRoot(document.getElementById("root")!).render(<App />);
