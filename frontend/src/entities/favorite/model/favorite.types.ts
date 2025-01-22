import { ProductPrice } from '@/entities/product'
import { Image } from '@/entities/user-listings/models/types.ts'

export interface FavoriteResponse {
  count: number
  next: string | null
  previous: string | null
  results: FavoriteItem[]
}

export interface FavoriteItem {
  id: number
  product_details: ProductDetails
  created_at: string
}

export interface ProductDetails {
  id: number
  title: string
  prices: ProductPrice[]
  images: Image[]
  active: boolean
  slug: string
  views: number
  created_at: string // ISO date string
  updated_at: string // ISO date string
}
