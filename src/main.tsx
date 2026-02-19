import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ThemeProvider } from './contexts/ThemeContext'
import { MirrorProvider } from './contexts/MirrorContext'
import './index.css'
import App from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <MirrorProvider>
        <App />
      </MirrorProvider>
    </ThemeProvider>
  </StrictMode>,
)
