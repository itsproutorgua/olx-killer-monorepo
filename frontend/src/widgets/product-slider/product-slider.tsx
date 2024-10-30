import React, { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'

import { ProductCard } from '@/widgets/product-card'
import { chunkArray } from '@/widgets/product-slider/model/product-slider-helper.ts'
import { Product, productApi, type ProductResponse } from '@/entities/product'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from '@/shared/ui/shadcn-ui/carousel.tsx'
import { SectionTitle } from '@/shared/ui'
import ProductCardLoaderSmall from '@/shared/ui/loaders/product-card-small.loader.tsx'
import { QUERY_KEYS } from '@/shared/constants'
import { cn } from '@/shared/library/utils'

interface ProductSliderProps {
  titleKey: string // Translation key for the title
  path: string // Products array
  chunkSize?: number // Default chunk size for pairing
  className?: string
  onProductClick: (slug: string) => void
}

export const ProductSlider: React.FC<ProductSliderProps> = ({
  titleKey,
  path,
  chunkSize = 2, // Default chunk size is set to 2
  className,
  onProductClick,
}) => {
  const { t } = useTranslation()
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)
  const [count, setCount] = useState(0)
  const [dynamicChunkSize, setDynamicChunkSize] = useState(chunkSize) // Track dynamic chunk size

  const { isLoading, data, isError } = useQuery<ProductResponse>({
    queryKey: [QUERY_KEYS.PRODUCTS, path],
    queryFn: () => productApi.findByFilters({ path, limit: 28 }),
  })

  // Handle screen size changes
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setDynamicChunkSize(3)
      } else {
        setDynamicChunkSize(2)
      }
    }

    handleResize() // Call once on mount
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    if (!api) return

    setCount(api.scrollSnapList().length)
    setCurrent(api.selectedScrollSnap() + 1)

    api.on('select', () => {
      setCurrent(api.selectedScrollSnap() + 1)
    })
  }, [api])

  if (isError) {
    return <div>{t('errors.noProducts')}</div>
  }

  return (
    <div className={className}>
      <Carousel
        className='mb-6'
        setApi={setApi}
        opts={{
          align: 'start',
          loop: true,
        }}
      >
        <SectionTitle title={t(titleKey)} />
        {/* Skeleton Loader: Display two skeletons per CarouselItem when loading */}
        {isLoading && (
          <CarouselContent>
            {Array.from({ length: 4 }).map((_, index) => (
              <CarouselItem key={index} className='flex gap-[10px]'>
                <ProductCardLoaderSmall key={`${index}-loader-1`} />
                <ProductCardLoaderSmall key={`${index}-loader-2`} />
              </CarouselItem>
            ))}
          </CarouselContent>
        )}
        {/* Actual Data */}
        {data && (
          <CarouselContent>
            {chunkArray(data.results.slice(0, 8), dynamicChunkSize).map(
              (pair: Product[], index: number) => (
                <CarouselItem key={index} className='flex gap-[10px]'>
                  {pair.map((deal: Product) => (
                    <div
                      key={deal.slug}
                      onClick={() => onProductClick(`/${deal.slug}`)}
                      className='w-[173px]'
                    >
                      <ProductCard product={deal} className='w-[172px]' />
                    </div>
                  ))}
                </CarouselItem>
              ),
            )}
          </CarouselContent>
        )}
        {/* DOTS */}
        <div className='absolute bottom-[-24px] left-1/2 flex -translate-x-1/2 items-center gap-1'>
          {Array.from({ length: count }).map((_, index: number) => {
            const isActive = index === current - 1

            return (
              <button
                key={index}
                onClick={() => api?.scrollTo(index)}
                className={cn(
                  'size-2 rounded-full transition-colors duration-300 hover:bg-primary-500 active:fill-primary-500 active:duration-0',
                  isActive ? 'bg-primary-900' : 'bg-gray-200',
                )}
              />
            )
          })}
        </div>
      </Carousel>
    </div>
  )
}
