import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

import { Providers } from './providers'

import '@/shared/config/i18next/i18next.ts'
import './styles/index.css'

import { CatalogPage } from '@/pages/catalog/catalog-page.tsx'
import { HomePage } from '@/pages/home/home-page'
import { RootLayout } from '@/pages/layouts'
import { ProductPage } from '@/pages/product/product-page.tsx'
import { ProfilePage } from '@/pages/profile/profile-page'
import { PUBLIC_PAGES } from '@/shared/constants'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Providers>
        <Routes>
          <Route path='/' element={<RootLayout />}>
            <Route index element={<HomePage />} />
            <Route path={PUBLIC_PAGES.PROFILE} element={<ProfilePage />} />
            <Route
              path={`${PUBLIC_PAGES.CATALOG}/*`}
              element={<CatalogPage />}
            />
            <Route
              path={`${PUBLIC_PAGES.PRODUCTS}/*`}
              element={<ProductPage />}
            />
            <Route path='*' element={<div>404 not found!</div>} />
          </Route>
        </Routes>
      </Providers>
    </BrowserRouter>
  </React.StrictMode>,
)
