import { useTranslation } from 'react-i18next'

import { FiltersButton } from '@/widgets/filters-button'
import { SortButton } from '@/widgets/sort-button'

export const PageToolbar = ({ count }: { count: number }) => {
  const { t } = useTranslation()

  return (
    <div className='pb-[53px]'>
      <div className='grid grid-cols-2 gap-3 md:hidden'>
        <FiltersButton />
        <SortButton />
      </div>

      <div className='hidden xl:block'>
        <div className='flex items-center justify-between border-b border-gray-200 py-[18px]'>
          <p className='text-base/5 font-medium'>
            {`${t('words.found')} ${count} ${t('words.announcements')}`}
          </p>
          <SortButton />
        </div>
      </div>
    </div>
  )
}
