import React from 'react'

import { ProductSlider } from '@/widgets/product-slider/product-slider.tsx'
import { SimilarProductProps } from '@/widgets/similar-products/similar-products.tsx'
import { useLatestProducts } from '@/entities/product/library/hooks/use-latest-products.tsx'
import { ProductSliderSkeleton } from '@/shared/ui/skeletons'

export const SimilarProductsSlider: React.FC<SimilarProductProps> = ({
  onProductClick,
}) => {
  const { data, cursor } = useLatestProducts({
    Skeleton: <ProductSliderSkeleton />,
  })
  return (
    <ProductSlider
      titleKey='title.similarProducts'
      data={data}
      cursor={cursor}
      chunkSize={2} // Set the chunk size as needed
      onProductClick={onProductClick}
    />
  )
}
