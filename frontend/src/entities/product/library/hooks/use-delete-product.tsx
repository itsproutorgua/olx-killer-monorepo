import { useMutation, useQueryClient } from '@tanstack/react-query'

import { productApi } from '@/entities/product'
import { useIdToken } from '@/entities/user/library/hooks/use-id-token.tsx'

export const useDeleteProduct = () => {
  const getIdToken = useIdToken()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (slug: string) => {
      const idToken = await getIdToken()
      return productApi.deleteProduct(slug, idToken)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['oka-user-listings'] })
    },
    onError: e => {
      console.error('Error during deleting listing', e)
    },
  })
}
