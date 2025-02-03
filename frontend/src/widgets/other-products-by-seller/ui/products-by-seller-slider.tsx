import React from 'react'

import { SellerProductProps } from '@/widgets/other-products-by-seller/products-by-seller.tsx'
import { ProductSlider } from '@/widgets/product-slider/product-slider.tsx'

export const ProductsBySellerSlider: React.FC<SellerProductProps> = ({
  onProductClick,
}) => {
  return (
    <ProductSlider
      titleKey='title.productsBySeller'
      limit={10}
      path='elektronika/telefony-i-aksesuary/mobilnye-telefony-smartfony'
      chunkSize={2} // Set the chunk size as needed
      onProductClick={onProductClick}
    />
  )
}
