import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router-dom'

import { FilterEnum } from '@/shared/constants/app.const'

export const useFiltersFromParams = () => {
  const { t } = useTranslation()
  const [searchParams] = useSearchParams()
  const filters: Partial<Record<FilterEnum, string>> = {}

  searchParams.forEach((value, key) => {
    const filterKey = key as FilterEnum
    if (Object.values(FilterEnum).includes(key as FilterEnum)) {
      switch (filterKey) {
        case FilterEnum.STATUS:
          filters[filterKey] = t(`filters.condition.${value}`) || 'value'
          break

        default:
          filters[filterKey] = value
          break
      }
    }
  })

  const count = Object.keys(filters).length

  return { filters, count }
}
