import React from 'react'
import { useQuery } from '@tanstack/react-query'

import { categoryApi, CategoryResponse } from '@/entities/category'
import { FetchError } from '@/shared/ui/error/fetch-error.tsx'

export const useCategories = ({
  page,
  Skeleton,
}: {
  page: number
  Skeleton?: React.ReactNode
}) => {
  const {
    isLoading,
    isError,
    data: categories,
  } = useQuery<CategoryResponse[]>({
    ...categoryApi.findAllCategoriesQueryOptions(page),
  })

  const cursor = (
    <>
      {isLoading && (Skeleton || <div>Loading...</div>)}
      {isError && <FetchError />}
    </>
  )
  return { categories, cursor }
}
