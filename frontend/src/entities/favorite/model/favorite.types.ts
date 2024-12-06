export interface FavoriteResponse {
  count: number // Total number of favorite items
  next: string | null // URL for the next page of results, or null if none
  previous: string | null // URL for the previous page of results, or null if none
  results: FavoriteItem[] // Array of favorite items
}

export interface FavoriteItem {
  id: number // ID of the favorite entry
  product_details: ProductDetails // Details of the favorited product
  created_at: string // Timestamp when the product was added to favorites
}

export interface ProductDetails {
  id: number // ID of the product
  title: string // Title of the product
  price: string // Price of the product
}
