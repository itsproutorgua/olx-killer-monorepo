export type SortValue =
  | 'price:asc'
  | 'price:desc'
  | 'created_at:asc'
  | 'created_at:desc'
  | ''

export interface SortOption {
  label: string
  value: SortValue
}
