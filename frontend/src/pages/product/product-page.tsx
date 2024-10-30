import { useEffect, useState } from 'react'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'

import {
  ProductsBySeller,
  ProductsBySellerSlider,
} from '@/widgets/other-products-by-seller'
import { ProductDetails } from '@/widgets/product-details/product-details.tsx'
import {
  SimilarProducts,
  SimilarProductsSlider,
} from '@/widgets/similar-products'
import { Product, productApi } from '@/entities/product'
import { Breadcrumbs } from '@/shared/ui'
import ProductPageSkeleton from '@/shared/ui/loaders/product-page.loader.tsx'
import { QUERY_KEYS } from '@/shared/constants'
import type { Crumb } from '@/shared/library/types/types.ts'
import { generateProductCrumbs } from '@/shared/library/utils/generate-crumbs.ts'

const formatPath = (pathname: string) => {
  const path = pathname.replace('/products', '')
  return path.split('?')[0]
}

export const ProductPage = () => {
  const { i18n } = useTranslation()
  const [slug, setSlug] = useState(
    location ? formatPath(location.pathname) : '',
  )
  const [crumbs, setCrumbs] = useState<Crumb[]>([{ text: '...' }])

  const {
    isLoading,
    data: product,
    isError,
  } = useQuery<Product>({
    queryKey: [QUERY_KEYS.PRODUCT, slug, i18n.language],
    queryFn: () => productApi.findBySlug({ slug }),
    placeholderData: keepPreviousData,
    enabled: !!slug,
  })

  const handleProductClick = (newSlug: string) => {
    setSlug(newSlug)
  }

  useEffect(() => {
    // Scroll to top on mount or when slug changes
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [slug])

  useEffect(() => {
    if (product) {
      generateProductCrumbs(product, setCrumbs)
    }
  }, [product])

  if (isError) {
    return <div>Error: An unknown error occurred</div>
  }

  return (
    <div className='container mt-[27px] md:mt-[38px]'>
      <Breadcrumbs crumbs={crumbs} />

      {isLoading || !product ? (
        <ProductPageSkeleton />
      ) : (
        <ProductDetails product={product} className='mb-20 md:mb-32' />
      )}

      <div className='mb-[53px] hidden min-h-[277px] md:relative md:block xl:min-h-[440px]'>
        <ProductsBySeller onProductClick={handleProductClick} />
      </div>

      <div className='mb-20 md:hidden'>
        <ProductsBySellerSlider onProductClick={handleProductClick} />
      </div>

      <div className='mb-[53px] hidden min-h-[277px] md:relative md:block xl:min-h-[440px]'>
        <SimilarProducts onProductClick={handleProductClick} />
      </div>

      <div className='mb-20 md:hidden'>
        <SimilarProductsSlider onProductClick={handleProductClick} />
      </div>
    </div>
  )
}
