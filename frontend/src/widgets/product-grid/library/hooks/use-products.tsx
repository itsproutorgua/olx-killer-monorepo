import { useQuery } from '@tanstack/react-query'

import {
  productApi,
  type FilterParams,
  type ProductResponse,
} from '@/entities/product'

export const useProducts = (params: FilterParams) => {
  const { data, isLoading, isPlaceholderData, isError } =
    useQuery<ProductResponse>({
      ...productApi.findByFiltersQueryOptions(params),
    })

  const cursor = (
    <div>
      {isLoading && <div>Loading...</div>}
      {isError && <div>Error</div>}
    </div>
  )
  return { data, cursor, isPlaceholderData }
}
