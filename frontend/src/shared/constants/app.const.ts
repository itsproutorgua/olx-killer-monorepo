import type { Sort } from '@/entities/product'

export const APP_VARIABLES = {
  BASE_URL: 'https://api.house-community.site/en/api/v1/',
  LIMIT: 21,
  LIMIT_MOBILE: 16,
} as const

export const SORT_VARIABLES: Record<string, Sort> = {
  created_dsc: 'crated_at:dsc',
  create_asc: 'crated_at:asc',
  price_asc: 'price:asc',
  price_dsc: 'price:dsc',
}
