import { useQuery } from '@tanstack/react-query'
import i18n from 'i18next'

import { userApi, UserProfile } from '@/entities/user'
import { useIdToken } from '@/entities/user/library/hooks/use-id-token.tsx'

export const useUserProfile = () => {
  const getIdToken = useIdToken()

  return useQuery<UserProfile>({
    queryKey: ['userProfile', i18n.language],
    queryFn: async () => {
      const idToken = await getIdToken()
      return userApi.fetchUserProfile(idToken)
    },
    enabled: !!getIdToken,
  })
}
