import { ProductSlider } from '@/widgets/product-slider/product-slider.tsx'
import { NEW_PRODUCTS } from '@/entities/product'

export const SimilarProductsSlider = () => {
  return (
    <ProductSlider
      titleKey='titles.similarProducts'
      products={NEW_PRODUCTS}
      chunkSize={2} // Set the chunk size as needed
    />
  )
}
