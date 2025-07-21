import { useQuery } from '@tanstack/react-query'

import { searchApi } from '@/entities/search/api/search.api.ts'

export const useSearch = (query: string, enabled: boolean) => {
  return useQuery({
    queryKey: ['search', query],
    queryFn: () => searchApi.getResults(query),
    enabled,
    staleTime: 1000 * 60 * 5,
  })
}
