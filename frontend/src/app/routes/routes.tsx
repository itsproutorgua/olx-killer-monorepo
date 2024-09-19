import { createBrowserRouter } from 'react-router-dom'

import { CatalogPage } from '@/pages/catalog/catalog-page'
import { HomePage } from '@/pages/home/home-page.tsx'
import { RootLayout } from '@/pages/layouts'
import { ProductPage } from '@/pages/product/product-page.tsx'
import { ProfilePage } from '@/pages/profile/profile-page.tsx'
import { PUBLIC_PAGES } from '@/shared/constants'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: PUBLIC_PAGES.PROFILE,
        element: <ProfilePage />,
      },
      {
        path: PUBLIC_PAGES.CATALOG,
        element: <CatalogPage />,
        children: [
          {
            path: 'category',
            element: <CatalogPage />,
          },
        ],
      },
      {
        path: PUBLIC_PAGES.PRODUCT,
        element: <ProductPage />,
      },
    ],
  },
  { path: '*', element: <div>404 not found!</div> },
])
