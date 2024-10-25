import type { Dispatch, SetStateAction } from 'react'

import type { CategoryParent } from '@/entities/category'
import { Product } from '@/entities/product'
import { PUBLIC_PAGES } from '@/shared/constants'
import type { Crumb } from '../types/types'

export const generateCrumbs = (
  data: CategoryParent,
  setData: Dispatch<SetStateAction<Crumb[]>>,
) => {
  const crumbs: Crumb[] = []
  let parent: CategoryParent | null = data

  while (parent) {
    crumbs.length === 0
      ? crumbs.unshift({ text: parent.title })
      : crumbs.unshift({
          text: parent.title,
          href: `${PUBLIC_PAGES.CATALOG}/${parent.path}`,
        })
    parent = parent.parent
  }
  setData(crumbs)
}

export const generateProductCrumbs = (
  product: Product,
  setData: Dispatch<SetStateAction<Crumb[]>>,
) => {
  const crumbs: Crumb[] = []
  let parent: CategoryParent | null = product.category

  // Traverse the category hierarchy to generate breadcrumbs
  while (parent) {
    crumbs.unshift({
      text: parent.title, // Add each category title to the breadcrumb
      href: `${PUBLIC_PAGES.CATALOG}/${parent.path}`, // Link to the category page
    })
    parent = parent.parent // Move up the category hierarchy
  }

  // Add the product itself as the last breadcrumb (without a link)
  crumbs.push({
    text: product.title, // Product title
  })

  setData(crumbs)
}
