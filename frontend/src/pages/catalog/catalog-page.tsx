import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate } from 'react-router-dom'

import {
  CategoryNavbar,
  CategoryNavbarSkeleton,
} from '@/widgets/category-navbar'
import { ProductGrid } from '@/widgets/product-grid'
import { categoryApi, type Category } from '@/entities/category'
import { Breadcrumbs, PageHeading } from '@/shared/ui'
import { PageHeadingSkeleton } from '@/shared/ui/skeletons/page-heading-skeleton'
import { QUERY_KEYS } from '@/shared/constants'
import type { Crumb } from '@/shared/library/types/types'
import { generateCrumbs } from '@/shared/library/utils/generate-crumbs'

export const CatalogPage = () => {
  const { i18n } = useTranslation()
  const location = useLocation()
  const navigate = useNavigate()
  const path = location.pathname.replace('/catalog', '')
  const [crumbs, setCrumbs] = useState<Crumb[]>([{ text: '...' }])

  const { isLoading, data } = useQuery<Category>({
    queryKey: [QUERY_KEYS.CATEGORY, path, i18n.language],
    queryFn: () => categoryApi.findByPath(path),
  })

  if (location.pathname === '/catalog') navigate('/')

  useEffect(() => {
    if (data) {
      generateCrumbs(data, setCrumbs)
    }
  }, [data])

  return (
    <div className='pb-32 pt-[27px] xl:pb-[53px] xl:pt-[38px]'>
      <div className='container'>
        <Breadcrumbs crumbs={crumbs} />

        {isLoading && (
          <>
            <PageHeadingSkeleton />
            <CategoryNavbarSkeleton />
          </>
        )}

        {!isLoading && data && (
          <>
            <PageHeading title={data.title} />
            <CategoryNavbar data={data.children} />
            <ProductGrid path={data.path} />
          </>
        )}
      </div>
    </div>
  )
}
