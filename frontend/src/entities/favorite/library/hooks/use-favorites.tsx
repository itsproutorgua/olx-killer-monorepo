import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { favoriteApi } from '@/entities/favorite/api/favorite.api.ts'
import { useIdToken } from '@/entities/user/library/hooks/use-id-token.tsx'

export const useFavorites = () => {
  const getIdToken = useIdToken()

  return useQuery({
    queryKey: ['favorites'],
    queryFn: async () => {
      const idToken = await getIdToken()
      return favoriteApi.getFavorites(idToken)
    },
  })
}

export const useFavoriteMutations = () => {
  const queryClient = useQueryClient()
  const getIdToken = useIdToken()

  const addToFavorites = useMutation({
    mutationFn: async (productId: number) => {
      const idToken = await getIdToken()
      return favoriteApi.addToFavorites(idToken, productId)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites'] })
    },
  })

  const removeFromFavorites = useMutation({
    mutationFn: async (productId: number) => {
      const idToken = await getIdToken()
      return favoriteApi.removeFromFavorites(idToken, productId)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites'] })
    },
  })

  return { addToFavorites, removeFromFavorites }
}
