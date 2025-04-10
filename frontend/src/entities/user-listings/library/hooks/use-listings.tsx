import React from 'react'
import { useQuery } from '@tanstack/react-query'

import {
  listingsApi,
  ListingsParams,
} from '@/entities/user-listings/api/user-listings.api.ts'
import { ListingResponse } from '@/entities/user-listings/models/types.ts'
import { FetchError } from '@/shared/ui/error/fetch-error.tsx'

export const useListings = (
  params: ListingsParams,
  { Skeleton }: { Skeleton?: React.ReactNode } = {},
) => {
  const { data, isLoading, isError } = useQuery<ListingResponse>({
    ...listingsApi.getListingsQueryOptions(params),
  })

  const cursor = (
    <>
      {isLoading && (Skeleton || <div>Loading...</div>)}
      {isError && <FetchError />}
    </>
  )

  return { data, cursor }
}
