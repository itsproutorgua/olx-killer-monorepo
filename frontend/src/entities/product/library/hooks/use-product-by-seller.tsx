import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'

import { productApi, ProductResponse } from '@/entities/product'
import { PageLoader } from '@/shared/ui'

export const useProductsBySeller = (
  profileId: string | number,
  { Skeleton }: { Skeleton?: React.ReactNode } = {},
) => {
  const { i18n } = useTranslation()

  const { data, isLoading, isPlaceholderData, isError } =
    useQuery<ProductResponse>({
      ...productApi.findBySellerQueryOptions(i18n, profileId),
    })

  const cursor = (
    <>
      {isLoading && (Skeleton || <PageLoader />)}
      {isError && (Skeleton || <div>Loading...</div>)}
    </>
  )

  return {
    data: data?.results ?? [],
    meta: {
      count: data?.count ?? 0,
      next: data?.next,
      previous: data?.previous,
    },
    cursor,
    isLoading,
    isError,
    isPlaceholderData,
  }
}
