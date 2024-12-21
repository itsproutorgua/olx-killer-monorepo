import { ProductPrice } from '@/entities/product'

export interface Image {
  id: number
  image: string
}

export interface Listing {
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

export interface ListingResponse {
  count: number
  total_count: number
  total_active: number
  total_inactive: number
  next: string | null
  previous: string | null
  results: Listing[]
}
