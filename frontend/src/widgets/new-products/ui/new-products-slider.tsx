import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'

import { ProductCard } from '@/widgets/product-card'
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

const path = 'elektronika/telefony-i-aksesuary/mobilnye-telefony-smartfony'

export const NewProductsSlider = () => {
  const [api, setApi] = useState<CarouselApi>(),
    [current, setCurrent] = useState(0),
    [count, setCount] = useState(0)

  const { t } = useTranslation()

  const { isLoading, data, isError } = useQuery<ProductResponse>({
    queryKey: [QUERY_KEYS.PRODUCTS, path],
    queryFn: () => productApi.findByFilters({ path, limit: 28 }),
  })

  useEffect(() => {
    if (!api) return

    setCount(api.scrollSnapList().length)
    setCurrent(api.selectedScrollSnap() + 1)

    api.on('select', () => {
      setCurrent(api.selectedScrollSnap() + 1)
    })
  }, [api])

  // Ensure the data is available and chunk it into pairs for the slider
  const chunkArray = (array: Product[], size: number) => {
    return array.reduce((result, item, index) => {
      if (item && index % size === 0) {
        result.push(array.slice(index, index + size))
      }
      return result
    }, [] as Product[][])
  }

  if (isError) {
    return <div>{t('errors.noProducts')}</div>
  }

  return (
    <Carousel
      className='mb-6 mt-[32px]'
      setApi={setApi}
      opts={{
        align: 'start',
        loop: true,
      }}
    >
      <SectionTitle title={t('titles.newProductsTitle')} />
      {isLoading && (
        <CarouselContent>
          {Array.from({ length: 2 }).map((_, index) => (
            <CarouselItem key={index} className='flex gap-[10px]'>
              <ProductCardLoaderSmall key={index} />
            </CarouselItem>
          ))}
        </CarouselContent>
      )}
      {data && (
        <CarouselContent>
          {chunkArray(data.results.slice(0, 8), 2).map((pair, index) => (
            <CarouselItem key={index} className='flex gap-[10px]'>
              {pair.map(deal => (
                <ProductCard
                  product={deal}
                  key={deal.slug}
                  className='w-[172px]'
                />
              ))}
            </CarouselItem>
          ))}
        </CarouselContent>
      )}

      {/* DOTS */}
      <div className='absolute bottom-[-24px] left-1/2 flex -translate-x-1/2 items-center gap-1'>
        {Array.from({ length: count }).map((_, index) => {
          const isActive = index === current - 1

          return (
            <button
              key={index}
              onClick={() => api?.scrollTo(index)}
              className={cn(
                'size-2 rounded-full transition-colors duration-300 hover:bg-primary-600',
                isActive ? 'bg-primary-900' : 'bg-gray-200',
              )}
            />
          )
        })}
      </div>
    </Carousel>
  )
}
