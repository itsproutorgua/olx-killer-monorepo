import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

import { Providers } from './providers'

import '@/shared/config/i18next/i18next.ts'
import './styles/index.css'

import PrivateRoute from '@/app/routes/private-routes.tsx'

import { AccountPage } from '@/pages/account/account-page.tsx'
import { ChatPage } from '@/pages/account/chat/chat-page.tsx'
import { FavoritesPage } from '@/pages/account/favorites/favorites-page.tsx'
import {
  CreateListingPage,
  CreateSuccess,
} from '@/pages/account/listings/create'
import { ProfilePage } from '@/pages/account/profile/profile-page.tsx'
import { SettingsPage } from '@/pages/account/settings/settings-page.tsx'
import { UserListingsPage } from '@/pages/account/user-listings/user-listings-page.tsx'
import { CatalogPage } from '@/pages/catalog/catalog-page.tsx'
import { HomePage } from '@/pages/home/home-page'
import { AccountLayout, RootLayout } from '@/pages/layouts'
import { AccountRootLayout } from '@/pages/layouts/account-root-layout.tsx'
import { ProductPage } from '@/pages/product/product-page.tsx'
import { SearchPage } from '@/pages/search/search-page.tsx'
import { PRIVATE_PAGES, PUBLIC_PAGES } from '@/shared/constants'
import { ScrollToTop } from '@/shared/library/utils/scroll-to-top.ts'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Providers>
        <ScrollToTop />
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
            <Route path={`${PUBLIC_PAGES.SEARCH}/*`} element={<SearchPage />} />
          </Route>
          <Route element={<AccountRootLayout />}>
            <Route element={<PrivateRoute />}>
              <Route path={PRIVATE_PAGES.ACCOUNT} element={<AccountLayout />}>
                <Route index element={<AccountPage />} />
                <Route
                  path={PRIVATE_PAGES.LISTINGS}
                  element={<UserListingsPage />}
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
              <Route
                path={PRIVATE_PAGES.LISTING_CREATE}
                element={<CreateListingPage />}
              />
              <Route
                path={PRIVATE_PAGES.LISTING_SUCCESS}
                element={<CreateSuccess />}
              />
            </Route>
          </Route>
          <Route path='*' element={<div>404 not found!</div>} />
        </Routes>
      </Providers>
    </BrowserRouter>
  </React.StrictMode>,
)
