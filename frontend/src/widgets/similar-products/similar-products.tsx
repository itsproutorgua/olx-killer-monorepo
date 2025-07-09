import React from 'react'
import { useTranslation } from 'react-i18next'

import { ScrollableProductList } from '@/widgets/scrollable-product-list/scrollable-product-list.tsx'
import { useProducts } from '@/entities/product'
import { ScrollableProductsSkeleton } from '@/shared/ui/skeletons'

export interface SimilarProductProps {
  onProductClick: (slug: string) => void
  path?: string
}

export const SimilarProducts: React.FC<SimilarProductProps> = ({
  onProductClick,
  path,
}) => {
  const { t } = useTranslation()
  const { data, cursor } = useProducts(
    { path: path || '', limit: 10 },
    { Skeleton: <ScrollableProductsSkeleton /> },
  )

  return (
    <ScrollableProductList
      title={t('title.similarProducts')}
      data={data?.results}
      cursor={cursor}
      scrollStep={3} // Number of items to scroll
      className='absolute flex w-[107%] overflow-hidden'
      onProductClick={onProductClick}
    />
  )
}
