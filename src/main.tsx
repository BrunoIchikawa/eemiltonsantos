import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './app/App'
import { SiteProvider } from './app/context/SiteContext'

import './styles/index.css'
import './styles/fonts.css'
import './styles/tailwind.css'
import './styles/theme.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <SiteProvider>
      <App />
    </SiteProvider>
  </React.StrictMode>,
)
