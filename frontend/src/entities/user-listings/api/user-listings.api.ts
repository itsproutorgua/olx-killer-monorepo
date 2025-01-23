import { keepPreviousData, queryOptions } from '@tanstack/react-query'

import { ListingResponse } from '@/entities/user-listings/models/types.ts'
import { instanceBase } from '@/shared/api'
import { QUERY_KEYS } from '@/shared/constants'

export interface ListingsParams {
  idToken: string
  activeTab?: string // 'active', 'inactive', or other statuses
  currentPage?: number
  PAGE_SIZE?: number
}

class ListingsApi {
  private BASE_URL = '/users/profile/products/'

  async getListings(
    { idToken, activeTab, currentPage = 1, PAGE_SIZE = 10 }: ListingsParams,
    { signal }: { signal: AbortSignal },
  ) {
    const params = new URLSearchParams()

    const status = {
      active: 'active',
      inactive: 'inactive',
      pending: 'draft',
      rejected: 'rejected',
    }

    if (activeTab) {
      const publicationStatus = status[activeTab as keyof typeof status]
      if (publicationStatus) {
        params.set('publication_status', publicationStatus)
      }
    }

    params.set('page', currentPage.toString())
    params.set('page_size', PAGE_SIZE.toString())

    const response = await instanceBase.get<ListingResponse>(
      `${this.BASE_URL}`,
      {
        headers: { Authorization: `Bearer ${idToken}` },
        params,
        signal,
      },
    )
    return response.data
  }

  getListingsQueryOptions({
    idToken,
    activeTab,
    currentPage = 1,
    PAGE_SIZE = 10,
  }: ListingsParams) {
    return queryOptions<ListingResponse>({
      queryKey: [
        QUERY_KEYS.LISTINGS,
        idToken,
        activeTab,
        currentPage,
        PAGE_SIZE,
      ],
      queryFn: meta =>
        this.getListings(
          {
            idToken,
            activeTab,
            currentPage,
            PAGE_SIZE,
          },
          meta,
        ),
      placeholderData: keepPreviousData,
    })
  }
}

export const listingsApi = new ListingsApi()
