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

export interface ProductVideo {
  id: number
  video: string
}

export interface Product {
  id: number
  title: string
  prices: ProductPrice[]
  description: string
  category: Category
  images: ProductImage[]
  seller: Seller
  status: string
  active: boolean
  views: number
  slug: string
  vies: number
  created_at: string
  updated_at: string
  video: ProductVideo
}

export type MediaItem = ProductImage | { type: 'video'; src: string }

export interface ProductResponse {
  count: number
  next: string | null
  previous: string | null
  results: Product[]
}

//for creating of listing
export interface ProductData {
  title: string
  prices: string
  description: string
  category_id: number
  uploaded_images?: File[] | undefined
  upload_video?: File | undefined
  status: 'new' | 'used'
}
