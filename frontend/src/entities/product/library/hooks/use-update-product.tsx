import { useMutation, useQueryClient } from '@tanstack/react-query'

import { productApi } from '@/entities/product'
import { useIdToken } from '@/entities/user/library/hooks/use-id-token.tsx'

export const useUpdateProduct = (slug: string) => {
  const getIdToken = useIdToken()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (productData: FormData) => {
      const idToken = await getIdToken()
      return productApi.updateProduct(productData, idToken, slug)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['oka-user-listings'],
      })
    },
    onError: () => {
      queryClient.invalidateQueries({
        queryKey: ['oka-user-listings'],
      })
    },
  })
}
