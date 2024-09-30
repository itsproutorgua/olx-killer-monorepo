import { useEffect, useState } from 'react'
import { cn } from '@/shared/library/utils'

import { PRODUCT_PHOTO } from '@/widgets/product-details/mock/product-images.mock.ts'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from '@/shared/ui/shadcn-ui/carousel.tsx'
import { Picture } from '@/shared/ui'

export const ProductCarousel = () => {
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)
  const [thumbsStartIndex, setThumbsStartIndex] = useState(0)
  const THUMBS_TO_SHOW = 5 // Number of thumbnails to display

  useEffect(() => {
    if (!api) {
      return
    }
    setCurrent(api.selectedScrollSnap() + 1)

    api.on('select', () => {
      const selectedSnap = api.selectedScrollSnap()
      setCurrent(selectedSnap + 1)

      // Adjust the thumbnail window based on the selected slide
      if (selectedSnap >= thumbsStartIndex + THUMBS_TO_SHOW) {
        setThumbsStartIndex(selectedSnap - THUMBS_TO_SHOW + 1)
      } else if (selectedSnap < thumbsStartIndex) {
        setThumbsStartIndex(0)
      }
    })
  }, [api, thumbsStartIndex])

  return (
    <div className='relative'>
      <Carousel
        setApi={setApi}
        opts={{
          align: 'start',
          loop: true,
        }}
      >
        <CarouselContent>
          {PRODUCT_PHOTO.map(item => (
            <CarouselItem key={item.id}>
              <Picture
                src={item.src}
                srcset={item.srcset}
                alt={item.alt}
                styles='max-w-full max-h-[613px] rounded-[15px]'
              />
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Thumbnail Preview with Arrows */}
        <div className='mt-[6px] flex items-center justify-center gap-[6px] md:mt-4 md:gap-[10px]'>
          <CarouselPrevious
            variant={null}
            size={null}
            className='static h-6 w-6 transform-none'
          >
            <svg
              width='25'
              height='24'
              viewBox='0 0 25 24'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                d='M9.65625 11.7187C9.5 11.875 9.5 12.0937 9.65625 12.25L14.2187 16.875C14.375 17.0312 14.625 17.0312 14.75 16.875L15.375 16.25C15.5313 16.125 15.5313 15.875 15.375 15.7187L11.6875 12L15.375 8.25C15.5313 8.09375 15.5313 7.875 15.375 7.71875L14.75 7.09375C14.625 6.9375 14.375 6.9375 14.2187 7.09375L9.65625 11.7187Z'
                fill='#333333'
              />
            </svg>
          </CarouselPrevious>
          <div className='flex max-w-2xl gap-[10px] overflow-hidden'>
            {PRODUCT_PHOTO.slice(
              thumbsStartIndex,
              thumbsStartIndex + THUMBS_TO_SHOW,
            ).map((item, index) => (
              <button
                key={index}
                onClick={() => api?.scrollTo(thumbsStartIndex + index)}
                className={cn(
                  'cursor-pointer',
                  thumbsStartIndex + index === current - 1
                    ? 'opacity-100'
                    : 'opacity-30',
                )}
              >
                <img
                  src={item.src}
                  alt={item.alt}
                  className='max-h-[48px] max-w-[48px] rounded md:max-h-[88px] md:max-w-[88px]'
                />
              </button>
            ))}
          </div>
          <CarouselNext
            variant={null}
            size={null}
            className='static h-6 w-6 transform-none text-primary-foreground'
          >
            <svg
              width='25'
              height='24'
              viewBox='0 0 25 24'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                d='M15.3438 12.2813C15.5 12.125 15.5 11.9063 15.3438 11.75L10.7813 7.125C10.625 6.96875 10.375 6.96875 10.25 7.125L9.625 7.75C9.46875 7.875 9.46875 8.125 9.625 8.28125L13.3125 12L9.625 15.75C9.46875 15.9063 9.46875 16.125 9.625 16.2813L10.25 16.9063C10.375 17.0625 10.625 17.0625 10.7813 16.9063L15.3438 12.2813Z'
                fill='#333333'
              />
            </svg>
          </CarouselNext>
        </div>
      </Carousel>
    </div>
  )
}
