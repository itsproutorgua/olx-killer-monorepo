import { ProductSlider } from '@/widgets/product-slider/product-slider.tsx'

export const NewProductsSlider = () => {
  return (
    <ProductSlider
      titleKey='title.newProductsTitle'
      path='elektronika/telefony-i-aksesuary/mobilnye-telefony-smartfony'
      limit={10}
      chunkSize={2} // Optional, defaults to 2
      className='mt-8'
      onProductClick={() => {}}
    />
  )
}
