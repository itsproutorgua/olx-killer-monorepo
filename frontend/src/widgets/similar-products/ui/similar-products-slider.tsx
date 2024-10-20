import { ProductSlider } from '@/widgets/product-slider/product-slider.tsx'

export const SimilarProductsSlider = () => {
  return (
    <ProductSlider
      titleKey='titles.similarProducts'
      path='elektronika/telefony-i-aksesuary/mobilnye-telefony-smartfony'
      chunkSize={2} // Set the chunk size as needed
    />
  )
}
