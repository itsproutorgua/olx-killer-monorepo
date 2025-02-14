import React, { useEffect, useState } from 'react'
import ReactPlayer from 'react-player'

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
import { VideoPlayIcon } from '@/shared/ui/icons'
import { CarouselThumbnailNext } from '@/shared/ui/icons/carouselThumbnailNext.tsx'
import { CarouselThumbnailPrevious } from '@/shared/ui/icons/carouselThumbnailPrevious.tsx'
import { useMediaQuery } from '@/shared/library/hooks'
import { cn } from '@/shared/library/utils'

interface Props {
  product: Product
  className?: string
}

export const ProductCarousel: React.FC<Props> = ({ product }) => {
  const [mainCarouselApi, setMainCarouselApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [thumbsStartIndex, setThumbsStartIndex] = useState(0)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [playing, setPlaying] = useState(false)
  const isMobile = useMediaQuery('(max-width: 767px)')
  const THUMBS_TO_SHOW = 5

  // Combine images and videos into a single media array
  const media = [
    ...(product.images?.map(img => ({ ...img, isImage: true })) || []),
    ...(product.video?.map(vid => ({ ...vid, isVideo: true })) || []),
  ]

  useEffect(() => {
    if (!mainCarouselApi) return

    setCurrent(mainCarouselApi.selectedScrollSnap() + 1)
    setCurrentIndex(mainCarouselApi.selectedScrollSnap())

    mainCarouselApi.on('select', () => {
      const selectedSnap = mainCarouselApi.selectedScrollSnap()
      setCurrent(selectedSnap + 1)
      setCurrentIndex(selectedSnap)

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
        opts={{ align: 'start', loop: true }}
      >
        <CarouselContent>
          {media.length > 0
            ? media.map((item, index) => (
                <CarouselItem key={item.id}>
                  <div className='flex h-[238px] w-[355px] cursor-pointer items-center justify-center rounded-[14px] bg-gray-100 md:h-[353px] md:w-full xl:h-[613px] xl:w-[629px]'>
                    {'isVideo' in item ? (
                      <div className='relative h-full w-full overflow-hidden rounded-[14px]'>
                        <ReactPlayer
                          url={item.video}
                          playing={playing}
                          height='100%'
                          width='100%'
                          onPlay={() => setPlaying(true)}
                          onPause={() => setPlaying(false)}
                          controls
                        />
                        {!isMobile && !playing && (
                          <div className='absolute left-1/2 top-[48%] -translate-x-1/2 -translate-y-1/2 transform text-white'>
                            <VideoPlayIcon
                              className='h-16 w-16'
                              onClick={e => {
                                e.preventDefault()
                                e.stopPropagation()
                                setPlaying(prev => !prev)
                              }}
                            />
                          </div>
                        )}
                      </div>
                    ) : (
                      <img
                        src={item.image}
                        alt={product.title || `Product image ${index + 1}`}
                        className='h-full w-full rounded-[14px] object-cover'
                        onClick={handleImageClick}
                      />
                    )}
                  </div>
                </CarouselItem>
              ))
            : Array.from({ length: 3 }).map((_, index) => (
                <CarouselItem key={index}>
                  <div className='flex h-[613px] w-full items-center justify-center rounded-[15px] bg-gray-50'>
                    <span>No Media Available</span>
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
            {media.length > 0
              ? media
                  .slice(thumbsStartIndex, thumbsStartIndex + THUMBS_TO_SHOW)
                  .map((item, index) => (
                    <button
                      key={item.id}
                      onClick={() =>
                        mainCarouselApi?.scrollTo(thumbsStartIndex + index)
                      }
                    >
                      <div className='relative flex h-[48px] w-[48px] items-center justify-center rounded bg-gray-100 md:h-[88px] md:w-[88px]'>
                        {'isVideo' in item ? (
                          <>
                            <video
                              className={cn(
                                'h-full w-full cursor-pointer rounded object-cover',
                                thumbsStartIndex + index === current - 1
                                  ? 'opacity-100'
                                  : 'opacity-30',
                              )}
                              muted
                              playsInline
                            >
                              <source src={item.video} type='video/mp4' />
                            </video>
                            <VideoPlayIcon className='absolute z-50 h-4 w-4 text-white opacity-100 md:h-7 md:w-7' />
                          </>
                        ) : (
                          <img
                            src={item.image}
                            alt={product.title || `Thumbnail ${index + 1}`}
                            className={cn(
                              'h-full w-full cursor-pointer rounded object-cover',
                              thumbsStartIndex + index === current - 1
                                ? 'opacity-100'
                                : 'opacity-30',
                            )}
                          />
                        )}
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
            View media of {product.title}. Use arrow keys to navigate through
            the images and videos.
          </p>
          <Carousel
            opts={{ align: 'start', loop: true, startIndex: currentIndex }}
          >
            <CarouselContent>
              {media.map(item => (
                <CarouselItem key={item.id}>
                  <div className='flex h-[85vh] w-full items-center justify-center'>
                    {'isVideo' in item ? (
                      <div className='relative'>
                        <ReactPlayer
                          url={item.video}
                          autoplay={true}
                          playing={playing}
                          height='100%'
                          width='100%'
                          onPlay={() => setPlaying(true)}
                          onPause={() => setPlaying(false)}
                          controls
                        />
                        {!isMobile && !playing && (
                          <div className='absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform text-white'>
                            <VideoPlayIcon
                              className='h-16 w-16 cursor-pointer'
                              onClick={() => setPlaying(prev => !prev)}
                            />
                          </div>
                        )}
                      </div>
                    ) : (
                      <img
                        src={item.image}
                        alt={`Product image ${item.id}`}
                        className='max-h-full max-w-full object-contain'
                      />
                    )}
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
