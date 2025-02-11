import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'

import { Product, productApi } from '@/entities/product'
import { FetchError } from '@/shared/ui/error/fetch-error.tsx'

export const useLatestProducts = ({
  Skeleton,
}: {
  Skeleton?: React.ReactNode
}) => {
  const { i18n } = useTranslation()
  const { data, isLoading, isError } = useQuery<Product[]>({
    ...productApi.findLatestQueryOptions(i18n),
  })

  const cursor = (
    <>
      {isLoading && (Skeleton || <div>Loading...</div>)}
      {isError && <FetchError />}
    </>
  )
  return { data, cursor }
}
