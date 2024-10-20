import { ProductSlider } from '@/widgets/product-slider/product-slider.tsx'

export const ProductsBySellerSlider = () => {
  return (
    <ProductSlider
      titleKey='titles.productsBySeller'
      path='elektronika/telefony-i-aksesuary/mobilnye-telefony-smartfony'
      chunkSize={2} // Set the chunk size as needed
    />
  )
}
