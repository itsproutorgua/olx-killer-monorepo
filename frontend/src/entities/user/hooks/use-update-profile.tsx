import { useMutation, useQueryClient } from '@tanstack/react-query'

import { userApi } from '@/entities/user'
import { useIdToken } from '@/entities/user/library/hooks/use-id-token.tsx'

export const useUpdateProfile = () => {
  const getIdToken = useIdToken()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (formData: FormData) => {
      const idToken = await getIdToken()
      return userApi.updateUserProfile(idToken, formData)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userProfile'] }) // Fixed error
    },
  })
}
