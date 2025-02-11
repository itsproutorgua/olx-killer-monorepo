import { ProductSlider } from '@/widgets/product-slider/product-slider.tsx'
import { useLatestProducts } from '@/entities/product/library/hooks/use-latest-products.tsx'
import { ProductSliderSkeleton } from '@/shared/ui/skeletons'

export const NewProductsSlider = () => {
  const { data, cursor } = useLatestProducts({
    Skeleton: <ProductSliderSkeleton />,
  })
  return (
    <ProductSlider
      titleKey='title.newProductsTitle'
      data={data}
      cursor={cursor}
      chunkSize={2} // Optional, defaults to 2
      className='mt-8'
      onProductClick={() => {}}
    />
  )
}
