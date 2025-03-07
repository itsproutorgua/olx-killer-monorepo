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
  label: 'filters.price',
  items: [{ label: '50' }, { label: '95900' }],
}

const CONDITION: Filter = {
  type: 'checkbox',
  name: 'status',
  label: 'filters.condition.title',
  items: [
    { label: 'filters.condition.new', value: 'new' },
    { label: 'filters.condition.used', value: 'used' },
  ],
}

export const FILTERS = [PRICE, CONDITION]
