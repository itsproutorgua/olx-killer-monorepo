import { FiltersSheet } from '@/widgets/filters-sheet'
import { SortButton } from '@/features/sort-button'

export const PageToolbarMobile = () => {
  return (
    <div className='grid grid-cols-2 gap-3'>
      <FiltersSheet />
      <SortButton />
    </div>
  )
}
