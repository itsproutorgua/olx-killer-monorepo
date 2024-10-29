type FilterType = 'Checkbox' | 'Slider'

export interface Filter {
  type: FilterType
  name: string
  label: string
  items: Array<{ label: string; hex?: string }>
}

const SUBCATEGORY: Filter = {
  type: 'Checkbox',
  name: 'Subcategory',
  label: 'Subcategory',
  items: [
    { label: 'Dresses' },
    { label: 'Tops and Blouses' },
    { label: 'Pants and Jeans' },
    { label: 'Skirts' },
    { label: 'Outerwear' },
    { label: 'Suits' },
    { label: 'Shorts' },
    { label: 'Sportswear' },
    { label: 'Underwear and pajamas' },
  ],
}

const PRICE: Filter = {
  type: 'Slider',
  name: 'Price',
  label: 'Price',
  items: [{ label: '50' }, { label: '95900' }],
}

const SIZE: Filter = {
  type: 'Checkbox',
  name: 'Size',
  label: 'Size',
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
  label: 'Colors',
  items: [
    { label: 'Beige', hex: '#FFE9B1' },
    { label: 'Blue', hex: '#6DE5FF' },
    { label: 'Burgundy', hex: '#8E0B0B' },
    { label: 'White', hex: '#FFFFFF' },
    { label: 'Yellow', hex: '##FFF500' },
    { label: 'Green', hex: '#00D42F' },
    { label: 'Brown', hex: '#763900' },
    { label: 'Orange', hex: '#FF8A00' },
    { label: 'Pink', hex: '#FF57E4' },
    { label: 'Violet', hex: '#9602F1' },
    { label: 'Red', hex: '#FF0000' },
    { label: 'Black', hex: '#000000' },
  ],
}

export const FILTERS = [SUBCATEGORY, PRICE, SIZE, COLORS]
