import type { Sort } from '@/entities/product'

export const APP_VARIABLES = {
  BASE_URL: 'https://api.house-community.site/en/api/v1/',
  LIMIT: 21,
  LIMIT_MOBILE: 16,
} as const

export const SORT_VARIABLES: Record<string, Sort> = {
  PRICE_ASC: 'price:asc',
  PRICE_DESC: 'price:desc',
  CREATED_AT_DESC: 'created_at:desc',
  RATING: 'rating',
}
