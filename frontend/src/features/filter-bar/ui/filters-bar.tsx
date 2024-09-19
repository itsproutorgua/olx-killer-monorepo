import { FiltersDesktop } from './filters-desktop'
import { FiltersMobile } from './filters-mobile'

export const FiltersBar = () => {
  return (
    <div>
      <FiltersMobile />
      <FiltersDesktop />
    </div>
  )
}
