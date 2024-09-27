import { ProductSlider } from '@/widgets/product-slider/product-slider.tsx'
import { NEW_PRODUCTS } from '@/entities/product'

export const ProductsBySellerSlider = () => {
  return (
    <ProductSlider
      titleKey='titles.productsBySeller'
      products={NEW_PRODUCTS}
      chunkSize={2} // Set the chunk size as needed
    />
  )
}
