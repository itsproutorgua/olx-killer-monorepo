import { useTranslation } from 'react-i18next'

import { SortButton } from '@/features/sort-button'
import { ProductsContext } from '@/entities/product'
import { useMediaQuery, useStrictContext } from '@/shared/library/hooks'
import { FilterTags } from './filter-tags'
import { PageToolbarMobile } from './page-toolbar-mobile'

export const PageToolbar = () => {
  const isMobile = useMediaQuery('(max-width: 767px)')
  const { t } = useTranslation()
  const { count } = useStrictContext(ProductsContext)

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
