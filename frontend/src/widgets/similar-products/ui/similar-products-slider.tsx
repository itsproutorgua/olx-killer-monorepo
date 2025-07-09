import React from 'react'

import { ProductSlider } from '@/widgets/product-slider/product-slider.tsx'
import { SimilarProductProps } from '@/widgets/similar-products/similar-products.tsx'
import { useProducts } from '@/entities/product'
import { ProductSliderSkeleton } from '@/shared/ui/skeletons'

export const SimilarProductsSlider: React.FC<SimilarProductProps> = ({
  onProductClick,
  path,
}) => {
  const { data, cursor } = useProducts(
    { path: path || '', limit: 10 },
    {
      Skeleton: <ProductSliderSkeleton />,
    },
  )
  return (
    <ProductSlider
      titleKey='title.similarProducts'
      data={data?.results}
      cursor={cursor}
      chunkSize={2} // Set the chunk size as needed
      onProductClick={onProductClick}
    />
  )
}
