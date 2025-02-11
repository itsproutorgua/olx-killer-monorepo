import React from 'react'
import { useQuery } from '@tanstack/react-query'

import { categoryApi, CategoryResponse } from '@/entities/category'
import { PageLoader } from '@/shared/ui'
import { FetchError } from '@/shared/ui/error/fetch-error.tsx'

export const useCategories = ({ Skeleton }: { Skeleton?: React.ReactNode }) => {
  const {
    isLoading,
    isError,
    data: categories,
  } = useQuery<CategoryResponse[]>({
    ...categoryApi.findAllCategoriesQueryOptions(),
  })

  const cursor = (
    <>
      {isLoading &&
        (Skeleton || (
          <div>
            <PageLoader />
          </div>
        ))}
      {isError && <FetchError />}
    </>
  )
  return { categories, cursor }
}
