import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'

import { Providers } from './providers'
import { router } from './routes'

import '@/shared/config/i18next/i18next.ts'
import './styles/index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Providers>
      <RouterProvider router={router} />
    </Providers>
  </React.StrictMode>,
)
