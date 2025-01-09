import { CircleX } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { useFilters } from '@/entities/filter'
import { FilterEnum } from '@/shared/constants/app.const'

export const FilterTags = () => {
  const { t } = useTranslation()
  const { filters, removeFilter, clearFilters, isFiltersEmpty } = useFilters()

  const onClear = () => {
    if (filters && Object.keys(filters).length > 0) {
      clearFilters()
    }
  }
  const onRemove = (key: FilterEnum) => removeFilter(key)

  return (
    <ul className='flex items-center gap-[14px]'>
      {!isFiltersEmpty && (
        <>
          <li>
            <button
              onClick={() => onClear()}
              className='flex h-9 items-center rounded-[100px] border border-error-500 px-[14px] text-error-500'
            >
              {t('buttons.cancelAll')}
            </button>
          </li>
          {Object.entries(filters).map(([key, value]) => (
            <li
              key={key}
              className='flex h-9 items-center gap-2.5 rounded-[100px] border border-border pl-[14px] pr-1'
            >
              <span className='text-sm font-medium'>
                {key === FilterEnum.PRICE
                  ? value
                  : t(`filters.condition.${value}`)}
              </span>
              <button
                onClick={() => onRemove(key as FilterEnum)}
                className='flex items-center justify-between'
              >
                <CircleX className='size-6 text-error-500' />
              </button>
            </li>
          ))}
        </>
      )}
    </ul>
  )
}
