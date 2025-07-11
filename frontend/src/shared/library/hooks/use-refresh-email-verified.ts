import { useCallback, useState } from 'react'
import { useAuth0 } from '@auth0/auth0-react'

import { isSafari } from '@/shared/library/utils'

export const useRefreshEmailVerified = () => {
  const {
    getIdTokenClaims,
    getAccessTokenSilently,
    loginWithRedirect,
    isLoading: isRefreshing,
  } = useAuth0()
  const [isEmailVerified, setIsEmailVerified] = useState<boolean | null>(null)

  const refreshEmailVerified = useCallback(async () => {
    try {
      if (!isSafari()) {
        await getAccessTokenSilently({
          detailedResponse: true,
          cacheMode: 'off', // force refresh (uses refresh token)
        })
      } else {
        await getAccessTokenSilently({
          detailedResponse: true,
        })
      }
      const claims = await getIdTokenClaims()
      setIsEmailVerified(claims?.email_verified || false)
    } catch (err: unknown) {
      if (
        typeof err === 'object' &&
        err !== null &&
        'error' in err &&
        err?.error === 'login_required'
      ) {
        await loginWithRedirect()
      } else {
        console.error('Unexpected error:', err)
        setIsEmailVerified(false)
      }
    }
  }, [getAccessTokenSilently, getIdTokenClaims, loginWithRedirect])

  return { isEmailVerified, refreshEmailVerified, isRefreshing }
}
