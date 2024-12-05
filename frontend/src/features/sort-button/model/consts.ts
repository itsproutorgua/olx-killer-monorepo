import i18n from '@/shared/config/i18next/i18next'
import { SortEnum } from '@/shared/constants/app.const'
import type { SortOption } from './types'

export const SORT_OPTIONS: Record<SortEnum, SortOption> = {
  'price:asc': {
    label: i18n.t('sort.priceExpensive'),
    value: SortEnum.PRICE_ASC,
  },
  'price:desc': {
    label: i18n.t('sort.priceCheap'),
    value: SortEnum.PRICE_DESC,
  },
  'created_at:desc': {
    label: i18n.t('sort.novelties'),
    value: SortEnum.CREATED_AT_DESC,
  },
}
