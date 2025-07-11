import React from 'react'

import { SellerProductProps } from '@/widgets/other-products-by-seller/products-by-seller.tsx'
import { ProductSlider } from '@/widgets/product-slider/product-slider.tsx'
import { useProductsBySeller } from '@/entities/product'
import { ProductSliderSkeleton } from '@/shared/ui/skeletons'

export const ProductsBySellerSlider: React.FC<SellerProductProps> = ({
  sellerId,
  onProductClick,
}) => {
  const { data, cursor } = useProductsBySeller(sellerId, {
    Skeleton: <ProductSliderSkeleton />,
  })
  return (
    <ProductSlider
      titleKey='title.productsBySeller'
      data={data}
      cursor={cursor}
      chunkSize={2} // Set the chunk size as needed
      onProductClick={onProductClick}
    />
  )
}
