import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'

import { Product, productApi } from '@/entities/product'
import { FetchError } from '@/shared/ui/error/fetch-error.tsx'

export const useProduct = (
  slug: string,
  options: { enabled?: boolean; Skeleton?: React.ReactNode } = {},
) => {
  const { i18n } = useTranslation()
  const { enabled = true, Skeleton } = options

  const { data, isLoading, isError, isSuccess } = useQuery<Product>({
    ...productApi.findBySlugQueryOptions({ slug }, i18n),
    enabled,
  })

  return {
    data,
    isSuccess,
    cursor: (
      <>
        {isLoading && (Skeleton || <div>Loading...</div>)}
        {isError && <FetchError />}
      </>
    ),
  }
}
