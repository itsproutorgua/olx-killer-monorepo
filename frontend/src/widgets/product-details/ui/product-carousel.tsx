import React, { useEffect, useState } from 'react'

import { Product } from '@/entities/product'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from '@/shared/ui/shadcn-ui/carousel.tsx'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/shadcn-ui/dialog.tsx'
import { CarouselThumbnailNext } from '@/shared/ui/icons/carouselThumbnailNext.tsx'
import { CarouselThumbnailPrevious } from '@/shared/ui/icons/carouselThumbnailPrevious.tsx'
import { cn } from '@/shared/library/utils'

interface Props {
  product: Product
  className?: string
}

export const ProductCarousel: React.FC<Props> = ({ product }) => {
  const [mainCarouselApi, setMainCarouselApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)
  const [currentIndex, setCurrentIndex] = useState(0) // Track current index for modal
  const [thumbsStartIndex, setThumbsStartIndex] = useState(0)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const THUMBS_TO_SHOW = 5

  const images =
    product.images && product.images.length > 0 ? product.images : null

  useEffect(() => {
    if (!mainCarouselApi) {
      return
    }

    setCurrent(mainCarouselApi.selectedScrollSnap() + 1)
    setCurrentIndex(mainCarouselApi.selectedScrollSnap()) // Initialize the current index

    mainCarouselApi.on('select', () => {
      const selectedSnap = mainCarouselApi.selectedScrollSnap()
      setCurrent(selectedSnap + 1)
      setCurrentIndex(selectedSnap) // Update the current index for the modal

      // Adjust thumbnail window based on the selected slide
      if (selectedSnap >= thumbsStartIndex + THUMBS_TO_SHOW) {
        setThumbsStartIndex(selectedSnap - THUMBS_TO_SHOW + 1)
      } else if (selectedSnap < thumbsStartIndex) {
        setThumbsStartIndex(0)
      }
    })
  }, [mainCarouselApi, thumbsStartIndex])

  const handleImageClick = () => setIsModalOpen(true)

  return (
    <div className='relative'>
      <Carousel
        setApi={setMainCarouselApi}
        opts={{
          align: 'start',
          loop: true,
        }}
      >
        <CarouselContent>
          {images
            ? images.map((image, index) => (
                <CarouselItem key={index}>
                  <div
                    onClick={handleImageClick}
                    className='flex h-[238px] w-[355px] cursor-pointer items-center justify-center rounded-[14px] bg-gray-100 md:h-[353px] md:w-full xl:h-[613px] xl:w-[629px]'
                  >
                    <img
                      src={image.image}
                      alt={product.title || `Product image ${index + 1}`}
                      className='h-full w-full rounded-[14px] object-cover'
                    />
                  </div>
                </CarouselItem>
              ))
            : Array.from({ length: 3 }).map((_, index) => (
                <CarouselItem key={index}>
                  <div className='flex h-[613px] w-full items-center justify-center rounded-[15px] bg-gray-50'>
                    <span>No Image Available</span>
                  </div>
                </CarouselItem>
              ))}
        </CarouselContent>

        {/* Thumbnail Preview with Arrows */}
        <div className='mt-[6px] flex items-center justify-center gap-[6px] md:mt-4 md:gap-[10px]'>
          <CarouselPrevious
            variant={null}
            size={null}
            className='static h-6 w-6 transform-none text-gray-900 hover:text-primary-500 active:text-primary-600'
          >
            <CarouselThumbnailPrevious />
          </CarouselPrevious>
          <div className='flex max-w-2xl gap-[10px] overflow-hidden'>
            {images
              ? images
                  .slice(thumbsStartIndex, thumbsStartIndex + THUMBS_TO_SHOW)
                  .map((image, index) => (
                    <button
                      key={index}
                      onClick={() =>
                        mainCarouselApi?.scrollTo(thumbsStartIndex + index)
                      }
                      className={cn(
                        'cursor-pointer',
                        thumbsStartIndex + index === current - 1
                          ? 'opacity-100'
                          : 'opacity-30',
                      )}
                    >
                      <div className='flex h-[48px] w-[48px] items-center justify-center rounded bg-gray-100 md:h-[88px] md:w-[88px]'>
                        <img
                          src={image.image}
                          alt={product.title || `Thumbnail ${index + 1}`}
                          className='h-full w-full rounded object-cover'
                        />
                      </div>
                    </button>
                  ))
              : Array.from({ length: THUMBS_TO_SHOW }).map((_, index) => (
                  <div
                    key={index}
                    className='max-h-[48px] max-w-[48px] rounded bg-gray-50 md:max-h-[88px] md:max-w-[88px]'
                  ></div>
                ))}
          </div>
          <CarouselNext
            variant={null}
            size={null}
            className='static h-6 w-6 transform-none text-gray-900 hover:text-primary-500 active:text-primary-600'
          >
            <CarouselThumbnailNext />
          </CarouselNext>
        </div>
      </Carousel>

      {/* Fullscreen Dialog Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className='rounded-[16px]' aria-describedby={undefined}>
          <DialogHeader>
            <DialogTitle>{product.title}</DialogTitle>
          </DialogHeader>
          <p id='dialog-description' className='sr-only'>
            View images of {product.title}. Use arrow keys to navigate through
            the images.
          </p>
          <Carousel
            opts={{
              align: 'start',
              loop: true,
              startIndex: currentIndex,
            }}
          >
            <CarouselContent>
              {images?.map((image, index) => (
                <CarouselItem key={index}>
                  <div className='flex h-[85vh] w-full items-center justify-center'>
                    <img
                      src={image.image}
                      alt={`Product image ${index + 1}`}
                      className='max-h-full max-w-full object-contain'
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious
              variant={null}
              size={null}
              className='absolute left-4 top-1/2 -translate-y-1/2 transform rounded-full bg-gray-900/30 p-2 text-white hover:bg-gray-900/50 active:bg-gray-900/70'
            />
            <CarouselNext
              variant={null}
              size={null}
              className='absolute right-4 top-1/2 -translate-y-1/2 transform rounded-full bg-gray-900/30 p-2 text-white hover:bg-gray-900/50 active:bg-gray-900/70'
            />
          </Carousel>
        </DialogContent>
      </Dialog>
    </div>
  )
}
