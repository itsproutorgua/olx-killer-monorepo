import React from 'react'
import { useTranslation } from 'react-i18next'

import { ScrollableProductList } from '@/widgets/scrollable-product-list/scrollable-product-list.tsx'
import { useProductsBySeller } from '@/entities/product'
import { ScrollableProductsSkeleton } from '@/shared/ui/skeletons'

export interface SellerProductProps {
  sellerId: string | number
  onProductClick: (slug: string) => void
}

export const ProductsBySeller: React.FC<SellerProductProps> = ({
  sellerId,
  onProductClick,
}) => {
  const { t } = useTranslation()
  const { data, cursor } = useProductsBySeller(sellerId, {
    Skeleton: <ScrollableProductsSkeleton />,
  })

  return (
    <ScrollableProductList
      title={t('title.productsBySeller')}
      data={data}
      cursor={cursor}
      scrollStep={3} // Number of items to scroll
      className='absolute flex w-[107%] overflow-hidden'
      onProductClick={onProductClick}
    />
  )
}
