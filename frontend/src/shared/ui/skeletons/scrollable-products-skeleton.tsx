import ProductCardLoader from '@/shared/ui/loaders/product-card.loader.tsx'

export const ScrollableProductsSkeleton = () => {
  return (
    <div className='flex gap-[7px] overflow-x-auto pb-[50px] pr-4 scrollbar-hide xl:gap-5'>
      {Array.from({ length: 10 }).map((_, index) => (
        <div key={index}>
          <ProductCardLoader />
        </div>
      ))}
    </div>
  )
}
