import React from 'react'
import { createRoot } from 'react-dom/client'
import Test from './Test.tsx'
import './index.css'

console.log('🚀 Starting React Test...')

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Test />
  </React.StrictMode>
)