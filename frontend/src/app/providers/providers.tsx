import React, { useState } from 'react'
import { Auth0Provider } from '@auth0/auth0-react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { Toaster } from 'react-hot-toast'

export const Providers = ({ children }: { children: React.ReactNode }) => {
  const [client] = useState(new QueryClient())

  return (
    <Auth0Provider
      domain='dev-oiwvoe5rjc073q1x.eu.auth0.com'
      clientId='GxCqyK8Oxo6xrwunlkNcoMo7pVUmC6xn'
      authorizationParams={{
        redirect_uri: window.location.origin,
      }}
    >
      <QueryClientProvider client={client}>
        {children}
        <Toaster />
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </Auth0Provider>
  )
}
