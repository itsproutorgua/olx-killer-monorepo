import { useTranslation } from 'react-i18next'

import { useFilters } from '@/entities/filter'
import { ProductsContext } from '@/entities/product'
import { useStrictContext } from '@/shared/library/hooks'

export const FiltersTabsFooter = ({
  onBack,
  onShow,
}: {
  onBack: (value: string) => void
  onShow: (value: string) => void
}) => {
  const { t } = useTranslation()
  const { count } = useStrictContext(ProductsContext)
  const { isFiltersEmpty } = useFilters()

  return (
    <div className='space-y-4 pb-2.5'>
      {!isFiltersEmpty && (
        <p className='border-t border-t-border pt-4 text-center text-[13px]/[15.6px] text-gray-400'>
          {t('words.found')} {count} {t('words.announcements')}
        </p>
      )}

      <div className='grid grid-cols-2 gap-2.5'>
        <button onClick={() => onBack('')} className='btn-secondary'>
          {t('buttons.back')}
        </button>
        <button onClick={() => onShow('')} className='btn-primary'>
          {t('buttons.show')}
        </button>
      </div>
    </div>
  )
}
