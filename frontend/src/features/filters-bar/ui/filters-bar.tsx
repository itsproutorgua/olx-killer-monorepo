import { useMediaQuery } from '@/shared/library/hooks'
import { FiltersForm } from './filters-form'
import { FiltersTabs } from './filters-tabs'

export const FiltersBar = ({ onCloseSheet }: { onCloseSheet?: () => void }) => {
  const isMobile = useMediaQuery('(max-width: 767px)')

  if (isMobile) {
    return <FiltersTabs onCloseSheet={onCloseSheet ?? (() => {})} />
  }

  return <FiltersForm />
}
