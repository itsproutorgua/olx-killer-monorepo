import i18n from '@/shared/config/i18next/i18next'
import type { SortOption } from './types'

export const SORT_OPTIONS: Record<string, SortOption> = {
  'price:asc': {
    label: i18n.t('sort.priceExpensive'),
    value: 'price:asc',
  },
  'price:desc': {
    label: i18n.t('sort.priceCheap'),
    value: 'price:desc',
  },
  'created_at:desc': {
    label: i18n.t('sort.novelties'),
    value: 'created_at:desc',
  },
}
