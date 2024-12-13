import { useTranslation } from 'react-i18next'

import { SortButton } from '@/features/sort-button'
import { useMediaQuery } from '@/shared/library/hooks'
import { FilterTags } from './filter-tags'
import { PageToolbarMobile } from './page-toolbar-mobile'

export const PageToolbar = ({ count }: { count: number }) => {
  const isMobile = useMediaQuery('(max-width: 767px)')
  const { t } = useTranslation()

  return (
    <div className='pb-[53px] xl:pb-0'>
      {isMobile ? (
        <PageToolbarMobile />
      ) : (
        <div className='flex items-center justify-between py-[18px]'>
          <div className='flex flex-1 items-center gap-[60px]'>
            <p className='text-base/5 font-medium'>
              {`${t('words.found')} ${count} ${t('words.announcements')}`}
            </p>
            <FilterTags />
          </div>

          <SortButton />
        </div>
      )}
    </div>
  )
}
