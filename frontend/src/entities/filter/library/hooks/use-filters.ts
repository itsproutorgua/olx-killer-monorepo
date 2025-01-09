import { FilterEnum, type SortEnum } from '@/shared/constants/app.const'
import { useQueryParams } from '@/shared/library/hooks'

export interface Filters {
  status?: string
  price?: string
}

export const useFilters = () => {
  const { getQueryParamByKey, setQueryParam, removeQueryParamByKey } =
    useQueryParams()

  const sort = getQueryParamByKey('sort') as SortEnum
  const page = getQueryParamByKey(FilterEnum.PAGE)
    ? Number(getQueryParamByKey(FilterEnum.PAGE))
    : 1

  // FILTERS
  const price = getQueryParamByKey(FilterEnum.PRICE)
  const status = getQueryParamByKey(FilterEnum.STATUS)

  const filters = { status, price }

  const currentFilters = Object.entries(filters).reduce((acc, [key, value]) => {
    if (value) {
      acc[key as keyof Filters] = value
    }
    return acc
  }, {} as Filters)

  const isFiltersEmpty = Object.values(filters).every(value => !value)

  const setFilter = (key: string, value: string) => setQueryParam(key, value)
  const removeFilter = (key: string) => removeQueryParamByKey([key])
  const clearFilters = () => {
    removeQueryParamByKey([FilterEnum.STATUS, FilterEnum.PRICE])
  }

  return {
    sort,
    page,
    filters: currentFilters,
    isFiltersEmpty,
    setFilter,
    removeFilter,
    clearFilters,
  }
}
