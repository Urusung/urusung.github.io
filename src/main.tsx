import React from 'react'
import { createRoot } from 'react-dom/client'
import { ThemeProvider } from 'next-themes'
import App from './App'
import './index.css'
createRoot(document.getElementById('root')!).render(<React.StrictMode><ThemeProvider attribute="class" defaultTheme="light" storageKey="career-theme" enableSystem={false} disableTransitionOnChange><App/></ThemeProvider></React.StrictMode>)
