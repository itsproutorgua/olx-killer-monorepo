import { InvalidateQueryFilters, QueryClient } from '@tanstack/react-query'

type DebouncerMap = Map<string, ReturnType<typeof setTimeout>>

const debouncers: DebouncerMap = new Map()

/**
 * Debounces the invalidation of a specific queryKey to avoid excessive refetches.
 * @param queryClient - instance from useQueryClient
 * @param queryKey - the queryKey to invalidate
 * @param delay - optional debounce delay (default 300ms)
 */
export function debounceInvalidateQuery(
  queryClient: QueryClient,
  queryKey: InvalidateQueryFilters['queryKey'],
  delay = 1000,
) {
  const key = JSON.stringify(queryKey)

  if (debouncers.has(key)) return

  const timeout = setTimeout(() => {
    queryClient.invalidateQueries({ queryKey })
    debouncers.delete(key)
  }, delay)

  debouncers.set(key, timeout)
}
