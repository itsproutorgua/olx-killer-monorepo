import { useCallback, useState } from 'react'
import { useAuth0 } from '@auth0/auth0-react'

export const useRefreshEmailVerified = () => {
  const { getIdTokenClaims } = useAuth0()
  const [isEmailVerified, setIsEmailVerified] = useState<boolean | null>(null)

  const refreshEmailVerified = useCallback(async () => {
    try {
      const claims = await getIdTokenClaims()
      setIsEmailVerified(claims?.email_verified || false)
    } catch (err) {
      console.error('Refresh failed:', err)
      setIsEmailVerified(false)
    }
  }, [getIdTokenClaims])

  return { isEmailVerified, refreshEmailVerified }
}
