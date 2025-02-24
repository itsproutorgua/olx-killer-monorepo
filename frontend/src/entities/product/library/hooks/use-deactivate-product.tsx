import { useMutation } from '@tanstack/react-query'

import { productApi } from '@/entities/product'
import { useIdToken } from '@/entities/user/library/hooks/use-id-token.tsx'

export const useDeactivateProduct = () => {
  const getIdToken = useIdToken()

  return useMutation({
    mutationFn: async ({
      productId,
      feedbackData,
    }: {
      productId: number
      feedbackData: { answer: string; description?: string }
    }) => {
      const idToken = await getIdToken()
      return productApi.deactivateProduct(productId, feedbackData, idToken)
    },
    onError: e => {
      console.error('Error during deactivating listing', e)
    },
  })
}
