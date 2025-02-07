import i18n from '@/shared/config/i18next/i18next'

type FilterType = 'checkbox' | 'slider'

export interface Filter {
  type: FilterType
  name: string
  label: string
  items: Array<{ name?: string; label: string; hex?: string; value?: string }>
}

const PRICE: Filter = {
  type: 'slider',
  name: 'price',
  label: i18n.t('filters.price'),
  items: [{ label: '50' }, { label: '95900' }],
}

const CONDITION: Filter = {
  type: 'checkbox',
  name: 'status',
  label: i18n.t('filters.condition.title'),
  items: [
    { label: i18n.t('filters.condition.new'), value: 'new' },
    { label: i18n.t('filters.condition.used'), value: 'used' },
  ],
}

export const FILTERS = [PRICE, CONDITION]
