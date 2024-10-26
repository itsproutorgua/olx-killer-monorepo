import { useMediaQuery } from '@/shared/library/hooks'
import { FiltersDesktop } from './filters-desktop'
import { FiltersMobile } from './filters-mobile'

export const FiltersBar = () => {
  const isMobile = useMediaQuery('(max-width: 767px)')

  if (isMobile) {
    return <FiltersMobile />
  }

  return <FiltersDesktop />
}
