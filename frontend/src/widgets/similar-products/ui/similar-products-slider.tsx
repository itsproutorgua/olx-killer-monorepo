import React from 'react'

import { ProductSlider } from '@/widgets/product-slider/product-slider.tsx'
import { SimilarProductProps } from '@/widgets/similar-products/similar-products.tsx'

export const SimilarProductsSlider: React.FC<SimilarProductProps> = ({
  onProductClick,
}) => {
  return (
    <ProductSlider
      titleKey='title.similarProducts'
      path='elektronika/telefony-i-aksesuary/mobilnye-telefony-smartfony'
      limit={10}
      chunkSize={2} // Set the chunk size as needed
      onProductClick={onProductClick}
    />
  )
}
