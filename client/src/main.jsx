import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { StateProvider } from './Context/StateContext.jsx'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StateProvider>
  <StrictMode>
    <App />
  </StrictMode>,
  </StateProvider>
)
