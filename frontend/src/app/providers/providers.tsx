import React from 'react'
import { AppState, Auth0Provider } from '@auth0/auth0-react'
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { Toaster } from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

import { queryClient } from '@/shared/api'

export const Providers = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate()

  const onRedirectCallback = (appState?: AppState) => {
    // Navigate to the returnTo path or fallback to the homepage
    navigate(appState?.targetUrl || window.location.pathname)
  }

  return (
    <Auth0Provider
      domain='dev-oiwvoe5rjc073q1x.eu.auth0.com'
      clientId='GxCqyK8Oxo6xrwunlkNcoMo7pVUmC6xn'
      authorizationParams={{
        redirect_uri: window.location.origin,
        audience: 'https://dev-oiwvoe5rjc073q1x.eu.auth0.com/api/v2/',
        scope: 'openid profile email offline_access',
      }}
      onRedirectCallback={onRedirectCallback}
      useRefreshTokens={true}
      useRefreshTokensFallback={true}
      cacheLocation='localstorage'
    >
      <QueryClientProvider client={queryClient}>
        {children}
        <Toaster />
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </Auth0Provider>
  )
}
