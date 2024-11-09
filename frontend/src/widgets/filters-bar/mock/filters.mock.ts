import i18n from '@/shared/config/i18next/i18next'

type FilterType = 'Checkbox' | 'Slider'

export interface Filter {
  type: FilterType
  name: string
  label: string
  items: Array<{ name?: string; label: string; hex?: string }>
}

const PRICE: Filter = {
  type: 'Slider',
  name: 'Price',
  label: i18n.t('filters.price'),
  items: [{ label: '50' }, { label: '95900' }],
}

const SIZE: Filter = {
  type: 'Checkbox',
  name: 'Size',
  label: i18n.t('filters.size'),
  items: [
    { label: 'XS' },
    { label: 'S' },
    { label: 'M' },
    { label: 'L' },
    { label: 'XL' },
    { label: '2XL' },
    { label: '3XL' },
    { label: '4XL' },
    { label: '5XL' },
  ],
}

const COLORS: Filter = {
  type: 'Checkbox',
  name: 'Colors',
  label: i18n.t('filters.colors'),
  items: [
    { name: 'beige', label: i18n.t('colors.beige'), hex: '#FFE9B1' },
    { name: 'blue', label: i18n.t('colors.blue'), hex: '#6DE5FF' },
    { name: 'burgundy', label: i18n.t('colors.burgundy'), hex: '#8E0B0B' },
    { name: 'white', label: i18n.t('colors.white'), hex: '#FFFFFF' },
    { name: 'yellow', label: i18n.t('colors.yellow'), hex: '##FFF500' },
    { name: 'green', label: i18n.t('colors.green'), hex: '#00D42F' },
    { name: 'brown', label: i18n.t('colors.brown'), hex: '#763900' },
    { name: 'orange', label: i18n.t('colors.orange'), hex: '#FF8A00' },
    { name: 'pink', label: i18n.t('colors.pink'), hex: '#FF57E4' },
    { name: 'violet', label: i18n.t('colors.violet'), hex: '#9602F1' },
    { name: 'red', label: i18n.t('colors.red'), hex: '#FF0000' },
    { name: 'black', label: i18n.t('colors.black'), hex: '#000000' },
  ],
}

export const FILTERS = [PRICE, SIZE, COLORS]
