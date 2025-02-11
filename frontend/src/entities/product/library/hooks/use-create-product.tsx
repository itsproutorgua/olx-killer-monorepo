import { useMutation, useQueryClient } from '@tanstack/react-query'

import { productApi } from '@/entities/product'
import { useIdToken } from '@/entities/user/library/hooks/use-id-token.tsx'

export const useCreateProduct = () => {
  const getIdToken = useIdToken()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (productData: FormData) => {
      const idToken = await getIdToken()
      return productApi.createProduct(productData, idToken)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['oka-products'] })
    },
  })
}
