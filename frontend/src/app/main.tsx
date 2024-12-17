import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

import { Providers } from './providers'

import '@/shared/config/i18next/i18next.ts'
import './styles/index.css'

import PrivateRoute from '@/app/routes/private-routes.tsx'

import { CatalogPage } from '@/pages/catalog/catalog-page.tsx'
import { ChatPage } from '@/pages/chat/chat-page.tsx'
import { FavoritesPage } from '@/pages/favorites/favorites-page.tsx'
import { HomePage } from '@/pages/home/home-page'
import { AccountLayout, RootLayout } from '@/pages/layouts'
import { ListingsPage } from '@/pages/listings/listings-page.tsx'
import { ProductPage } from '@/pages/product/product-page.tsx'
import { ProfilePage } from '@/pages/profile/profile-page.tsx'
import { SettingsPage } from '@/pages/settings/settings-page.tsx'
import { PRIVATE_PAGES, PUBLIC_PAGES } from '@/shared/constants'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Providers>
        <Routes>
          <Route path='/' element={<RootLayout />}>
            <Route index element={<HomePage />} />
            <Route
              path={`${PUBLIC_PAGES.CATALOG}/*`}
              element={<CatalogPage />}
            />
            <Route
              path={`${PUBLIC_PAGES.PRODUCTS}/*`}
              element={<ProductPage />}
            />
            <Route element={<PrivateRoute />}>
              <Route path={PRIVATE_PAGES.ACCOUNT} element={<AccountLayout />}>
                <Route index element={<ListingsPage />} />
                <Route
                  path={PRIVATE_PAGES.LISTINGS}
                  element={<ListingsPage />}
                />
                <Route path={PRIVATE_PAGES.CHAT} element={<ChatPage />} />
                <Route
                  path={PRIVATE_PAGES.FAVORITE}
                  element={<FavoritesPage />}
                />
                <Route path={PRIVATE_PAGES.PROFILE} element={<ProfilePage />} />
                <Route
                  path={PRIVATE_PAGES.SETTINGS}
                  element={<SettingsPage />}
                />
              </Route>
            </Route>
            <Route path='*' element={<div>404 not found!</div>} />
          </Route>
        </Routes>
      </Providers>
    </BrowserRouter>
  </React.StrictMode>,
)
