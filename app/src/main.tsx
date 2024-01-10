import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'

import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle'
import '@fortawesome/fontawesome-free/css/all.min.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)