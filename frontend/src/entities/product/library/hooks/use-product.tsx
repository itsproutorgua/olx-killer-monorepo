import React from 'react'
import { useQuery } from '@tanstack/react-query'

import { Product, productApi } from '@/entities/product'
import { FetchError } from '@/shared/ui/error/fetch-error.tsx'

export const useProduct = (
  slug: string,
  { Skeleton }: { Skeleton?: React.ReactNode },
) => {
  const { data, isLoading, isError } = useQuery<Product>({
    ...productApi.findBySlugQueryOptions({ slug }),
  })

  const cursor = (
    <>
      {isLoading && (Skeleton || <div>Loading...</div>)}
      {isError && <FetchError />}
    </>
  )
  return { data, cursor }
}
