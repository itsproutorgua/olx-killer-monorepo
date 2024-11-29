import ProductCardLoaderSmall from '@/shared/ui/loaders/product-card-small.loader.tsx'
import ProductCardLoader from '@/shared/ui/loaders/product-card.loader.tsx'
import { useMediaQuery } from '@/shared/library/hooks'

export const BestDealsSkeleton = () => {
  const isDesktop = useMediaQuery('(min-width: 1440px)')
  return (
    <div className='grid grid-cols-2 gap-x-[10px] gap-y-[40px] self-center md:grid-cols-3 xl:grid-cols-4 xl:gap-x-5 xl:gap-y-[60px]'>
      {Array.from({ length: 8 }).map((_, index) =>
        isDesktop ? (
          <ProductCardLoader key={index} />
        ) : (
          <ProductCardLoaderSmall key={index} />
        ),
      )}
    </div>
  )
}
