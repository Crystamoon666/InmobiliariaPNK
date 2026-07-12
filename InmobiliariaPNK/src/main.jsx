import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/theme.css'   // Design system PNK — importar PRIMERO
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
