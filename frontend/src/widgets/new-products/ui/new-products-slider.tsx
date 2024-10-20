import { ProductSlider } from '@/widgets/product-slider/product-slider.tsx'

export const NewProductsSlider = () => {
  return (
    <ProductSlider
      titleKey='titles.newProductsTitle'
      path='elektronika/telefony-i-aksesuary/mobilnye-telefony-smartfony'
      chunkSize={2} // Optional, defaults to 2
      className='mt-8'
    />
  )
}
