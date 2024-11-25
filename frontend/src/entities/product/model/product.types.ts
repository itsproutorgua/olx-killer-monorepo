import type { Category } from '@/entities/category'
import type { Seller } from '@/entities/seller'

export const SortEnum: Record<string, Sort> = {
  PRICE_ASC: 'price:asc',
  PRICE_DESC: 'price:desc',
  CREATED_AT_DESC: 'created_at:desc',
  RATING: 'rating',
}

export type Sort =
  | 'price:asc'
  | 'price:desc'
  | 'created_at:asc'
  | 'created_at:desc'
  | 'rating'

export interface ProductCurrency {
  id: number
  code: string
  symbol: string
  name: string
}

export interface ProductPrice {
  id: string
  amount: string
  currency: ProductCurrency
}

export interface ProductImage {
  id: number
  image: string
}

export interface Product {
  title: string
  prices: ProductPrice[]
  description: string
  category: Category
  images: ProductImage[]
  seller: Seller
  views: number
  slug: string
  vies: number
  created_at: string
  updated_at: string
}

export interface ProductResponse {
  count: number
  next: string | null
  previous: string | null
  results: Product[]
}
