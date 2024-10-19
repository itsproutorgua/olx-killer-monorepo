import type { Dispatch, SetStateAction } from 'react'

import type { CategoryParent } from '@/entities/category'
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
