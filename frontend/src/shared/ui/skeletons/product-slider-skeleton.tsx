import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/shared/ui/shadcn-ui/carousel.tsx'
import ProductCardLoaderSmall from '@/shared/ui/loaders/product-card-small.loader.tsx'

export const ProductSliderSkeleton = () => {
  return (
    <Carousel>
      <CarouselContent>
        {Array.from({ length: 4 }).map((_, index) => (
          <CarouselItem key={index} className='flex gap-[10px]'>
            <ProductCardLoaderSmall key={`${index}-loader-1`} />
            <ProductCardLoaderSmall key={`${index}-loader-2`} />
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  )
}
