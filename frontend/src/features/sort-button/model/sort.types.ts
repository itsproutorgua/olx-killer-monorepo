export type SortValue =
  | 'price:asc'
  | 'price:desc'
  | 'created_at:asc'
  | 'created_at:desc'
  | 'status:desc'
  | 'status:asc'

export interface SortOption {
  label: string
  value: SortValue
}
