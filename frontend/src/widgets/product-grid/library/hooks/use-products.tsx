import React from 'react'
import { useQuery } from '@tanstack/react-query'

import {
  productApi,
  type FilterParams,
  type ProductResponse,
} from '@/entities/product'
import { FetchError } from '@/shared/ui/error/fetch-error.tsx'

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
      {isError && <FetchError />}
    </>
  )
  return { data, cursor, isPlaceholderData }
}
