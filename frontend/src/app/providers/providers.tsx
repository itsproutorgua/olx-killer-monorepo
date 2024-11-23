import React from 'react'
import { Auth0Provider } from '@auth0/auth0-react'
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { Toaster } from 'react-hot-toast'

import { queryClient } from '@/shared/api'

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <Auth0Provider
      domain='dev-oiwvoe5rjc073q1x.eu.auth0.com'
      clientId='GxCqyK8Oxo6xrwunlkNcoMo7pVUmC6xn'
      authorizationParams={{
        redirect_uri: window.location.origin,
      }}
    >
      <QueryClientProvider client={queryClient}>
        {children}
        <Toaster />
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </Auth0Provider>
  )
}
