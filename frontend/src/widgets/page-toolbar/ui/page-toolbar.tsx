import { FiltersButton } from '@/widgets/filters-button'
import { SortButton } from '@/widgets/sort-button'

export const PageToolbar = () => {
  return (
    <div className='pb-[53px]'>
      <div className='grid grid-cols-2 gap-3 md:hidden'>
        <FiltersButton />
        <SortButton />
      </div>

      <div className='hidden xl:block'>
        <div className='flex items-center justify-between border-b border-gray-200 py-[18px]'>
          <p className='text-base/5 font-medium'>Found 3568 announcements</p>
          <SortButton />
        </div>
      </div>
    </div>
  )
}
