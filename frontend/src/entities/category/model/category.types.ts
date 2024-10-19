//types for categories and subcategories
export interface CategoryResponse {
  title: string
  path: string
  icon: string | null
  img: string
  children: Subcategory[]
}

export interface Subcategory {
  title: string
  path: string
  parent_id: number | null
  icon: string | null
  img: string | null
  children: Item[]
}

export interface Item {
  title: string
  path: string
  parent_id: number | null
  icon: string | null
  img: string | null
  children: [] // Assumes no further depth beyond this level
}
