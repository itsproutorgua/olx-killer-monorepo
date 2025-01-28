import React from 'react'
import { useQuery } from '@tanstack/react-query'

import {
  productApi,
  type FilterParams,
  type ProductResponse,
} from '@/entities/product'
import { PageLoader } from '@/shared/ui'

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
      {isLoading && (Skeleton || <PageLoader />)}
      {isError && (Skeleton || <div>Loading...</div>)}
    </>
  )
  return { data, cursor, isPlaceholderData, isLoading, isError }
}
