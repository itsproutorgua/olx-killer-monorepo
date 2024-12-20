import React from 'react'
import { useQuery } from '@tanstack/react-query'

import {
  productApi,
  type FilterParams,
  type ProductResponse,
} from '@/entities/product'

export const useProducts = (
  params: FilterParams,
  { Skeleton }: { Skeleton?: React.ReactNode },
) => {
  const { data, isLoading, isPlaceholderData, isError } =
    useQuery<ProductResponse>({
      ...productApi.findByFiltersQueryOptions(params),
    })

  const cursor = (
    <>
      {isLoading && (Skeleton || <div>Loading...</div>)}
      {isError && (Skeleton || <div>Loading...</div>)}
    </>
  )
  return { data, cursor, isPlaceholderData }
}
