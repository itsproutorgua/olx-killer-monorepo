import { useAuth0 } from '@auth0/auth0-react'

export const useIdToken = () => {
  const { getIdTokenClaims } = useAuth0()

  return async (): Promise<string> => {
    const claims = await getIdTokenClaims()
    const idToken = claims?.__raw
    if (!idToken) throw new Error('Failed to retrieve idToken')
    return idToken
  }
}
