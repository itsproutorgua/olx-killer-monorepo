import { queryOptions } from '@tanstack/react-query'
import i18n from 'i18next'

import { Location } from '@/entities/locations/model/types'
import { instanceBase } from '@/shared/api'
import { QUERY_KEYS } from '@/shared/constants'

interface LocationResponse {
  results: Location[]
}

class LocationApi {
  private BASE_URL = '/locations'

  async searchLocations({
    searchTerm,
    signal,
  }: {
    searchTerm: string
    signal?: AbortSignal
  }) {
    const url = `${this.BASE_URL}/?location_name=${encodeURIComponent(searchTerm)}`
    const response = await instanceBase.get<LocationResponse>(url, { signal })
    return response.data.results
  }

  searchLocationsQueryOptions(searchTerm: string) {
    return queryOptions<Location[]>({
      queryKey: [QUERY_KEYS.LOCATIONS, i18n.language, searchTerm],
      queryFn: ({ signal }) => this.searchLocations({ searchTerm, signal }),
      retry: 1,
      refetchOnWindowFocus: false,
      enabled: searchTerm.length >= 3, // Only enable query when 3+ characters
    })
  }
}

export const locationApi = new LocationApi()
