import type { Category } from '@/entities/category'
import type { Seller } from '@/entities/seller'

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
