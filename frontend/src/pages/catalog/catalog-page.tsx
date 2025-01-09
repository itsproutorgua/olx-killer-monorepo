import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate } from 'react-router-dom'

import { CategoryNavbar } from '@/widgets/category-navbar'
import { ProductGrid, ProductGridMobile } from '@/widgets/product-grid'
import { categoryApi, type Category } from '@/entities/category'
import { ProductsProvider } from '@/entities/product'
import { Breadcrumbs, PageHeading, PageLoader } from '@/shared/ui'
import { QUERY_KEYS } from '@/shared/constants'
import { useMediaQuery } from '@/shared/library/hooks'
import type { Crumb } from '@/shared/library/types'
import { generateCrumbs } from '@/shared/library/utils/generate-crumbs'

const formatPath = (pathname: string) => {
  const path = pathname.replace('/catalog', '')
  return path.split('?')[0]
}

export const CatalogPage = () => {
  const { i18n } = useTranslation()
  const location = useLocation()
  const navigate = useNavigate()
  const path = formatPath(location.pathname)
  const [crumbs, setCrumbs] = useState<Crumb[]>([{ text: '...' }])
  const isMobile = useMediaQuery('(max-width: 767px)')

  const { isLoading, data } = useQuery<Category>({
    queryKey: [QUERY_KEYS.CATEGORY, path, i18n.language],
    queryFn: () => categoryApi.findCategoryByPath(path),
  })

  if (location.pathname === '/catalog') navigate('/')

  useEffect(() => {
    if (data) {
      generateCrumbs(data, setCrumbs)
    }
  }, [data])

  return (
    <div className='min-h-screen pb-32 pt-[27px] xl:pb-[53px] xl:pt-[38px]'>
      <div className='container'>
        <Breadcrumbs crumbs={crumbs} />

        {isLoading && <PageLoader />}

        {!isLoading && data && (
          <>
            <PageHeading title={data.title} />
            <CategoryNavbar data={data.children} />

            <ProductsProvider>
              {isMobile ? (
                <ProductGridMobile path={data.path} />
              ) : (
                <ProductGrid path={data.path} />
              )}
            </ProductsProvider>
          </>
        )}
      </div>
    </div>
  )
}
