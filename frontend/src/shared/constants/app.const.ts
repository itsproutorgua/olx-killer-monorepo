export const APP_VARIABLES = {
  BASE_URL: 'https://api.house-community.site/en/api/v1/',
  LIMIT: 21,
  LIMIT_MOBILE: 16,
} as const

export enum SortEnum {
  PRICE_ASC = 'price:asc',
  PRICE_DESC = 'price:desc',
  CREATED_AT_DESC = 'created_at:desc',
}

export enum FilterEnum {
  PRICE_MIN = 'price_min',
  PRICE_MAX = 'price_max',
  PRICE = 'price', //range 100-200
  STATUS = 'status',
}
