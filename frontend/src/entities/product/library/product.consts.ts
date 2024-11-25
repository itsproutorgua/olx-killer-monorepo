import type { Sort } from '../model'

export const SORT_VARIABLES: Record<string, Sort> = {
  PRICE_ASC: 'price:asc',
  PRICE_DESC: 'price:desc',
  CREATED_AT_DESC: 'created_at:desc',
  RATING: 'rating',
}
