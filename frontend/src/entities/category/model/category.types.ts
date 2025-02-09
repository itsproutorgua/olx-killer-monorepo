//types for categories and subcategories
// type Parent = {
//   [key: string]: string
// }

export interface CategoryParent {
  id: number
  title: string
  path: string
  views: number
  parent: CategoryParent | null
}

export interface CategoryChild {
  id: number
  title: string
  path: string
  views: number
  products_cumulative_count: number
  icon?: string | null
  img?: string | null
}

export interface Category {
  id: number
  title: string
  path: string
  views: number
  img_url: string | null
  icon_url: string | null
  parent: CategoryParent | null
  children: CategoryChild[]
}

export interface CategoryResponse {
  id: number
  title: string
  path: string
  icon: string | null
  img?: string
  children: Subcategory[]
}

export interface Subcategory {
  id: number
  title: string
  path: string
  parent_id: number | null
  icon: string | null
  img: string | null
  children: Item[]
}

export interface Item {
  id: number
  title: string
  path: string
  parent_id: number | null
  icon: string | null
  img: string | null
  children: [] // Assumes no further depth beyond this level
}
