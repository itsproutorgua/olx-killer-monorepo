import { useMediaQuery } from '@/shared/library/hooks'
import { FiltersForm } from './filters-form'
import { FiltersTabs } from './filters-tabs'

export const FiltersBar = () => {
  const isMobile = useMediaQuery('(max-width: 767px)')

  if (isMobile) {
    return <FiltersTabs />
  }

  return <FiltersForm />
}
