import { useEffect, useState } from 'react'

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from '@/shared/ui/shadcn-ui/carousel.tsx'
import { Picture } from '@/shared/ui'
import { cn } from '@/shared/lib/utils'
import { HERO_DATA } from '../mock/hero.mock'

export const HeroSlider = () => {
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!api) {
      return
    }

    setCount(api.scrollSnapList().length)
    setCurrent(api.selectedScrollSnap() + 1)

    api.on('select', () => {
      setCurrent(api.selectedScrollSnap() + 1)
    })
  }, [api])
  return (
    <Carousel
      setApi={setApi}
      opts={{
        align: 'start',
        loop: true,
      }}
    >
      <CarouselContent>
        {HERO_DATA.map(item => (
          <CarouselItem key={item.id}>
            <Picture
              src={item.src}
              srcset={item.srcset}
              alt={item.alt}
              styles='w-full max-h-[329px] rounded-[15px]'
            />
          </CarouselItem>
        ))}
      </CarouselContent>

      {/* BUTTONS */}
      <CarouselPrevious
        variant={null}
        size={null}
        className='left-[7px] text-primary-foreground xl:hidden'
      >
        <svg
          width='18'
          height='35'
          viewBox='0 0 18 35'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
        >
          <path
            d='M17.6948 34.7062C17.5147 34.8928 17.27 34.9984 17.0142 35C16.8873 35.0012 16.7614 34.9758 16.6444 34.9252C16.5274 34.8747 16.4216 34.8002 16.3336 34.7062L0.284548 18.2112C0.194414 18.1197 0.122849 18.0108 0.0740013 17.8907C0.0251541 17.7707 0 17.6418 0 17.5116C0 17.3815 0.0251541 17.2526 0.0740013 17.1325C0.122849 17.0125 0.194414 16.9035 0.284548 16.8121L16.3336 0.313638C16.4218 0.216682 16.5282 0.138962 16.6462 0.0851042C16.7643 0.0312462 16.8917 0.00235076 17.0209 0.000137555C17.15 -0.00207565 17.2783 0.0224386 17.398 0.0722214C17.5178 0.122004 17.6266 0.196038 17.7179 0.289917C17.8093 0.383796 17.8813 0.495601 17.9297 0.618679C17.9782 0.741758 18.002 0.873593 17.9999 1.00634C17.9977 1.13909 17.9696 1.27003 17.9172 1.39138C17.8648 1.51273 17.7892 1.62201 17.6948 1.7127L2.32641 17.5116L17.6948 33.3071C17.7846 33.3988 17.8558 33.5078 17.9044 33.6278C17.9529 33.7479 17.978 33.8766 17.978 34.0066C17.978 34.1367 17.9529 34.2654 17.9044 34.3854C17.8558 34.5055 17.7846 34.6145 17.6948 34.7062Z'
            fill='currentColor'
          />
        </svg>
      </CarouselPrevious>
      <CarouselNext
        variant={null}
        size={null}
        className='right-[7px] text-primary-foreground xl:hidden'
      >
        <svg
          width='18'
          height='35'
          viewBox='0 0 18 35'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
        >
          <path
            d='M0.305159 34.7062C0.485271 34.8928 0.73002 34.9984 0.985781 35C1.11271 35.0012 1.23855 34.9758 1.35559 34.9252C1.47262 34.8747 1.57838 34.8002 1.6664 34.7062L17.7155 18.2112C17.8056 18.1197 17.8772 18.0108 17.926 17.8907C17.9748 17.7707 18 17.6418 18 17.5116C18 17.3815 17.9748 17.2526 17.926 17.1325C17.8772 17.0125 17.8056 16.9035 17.7155 16.8121L1.6664 0.313638C1.57816 0.216682 1.47184 0.138962 1.35377 0.0851042C1.2357 0.0312462 1.10829 0.00235076 0.979134 0.000137555C0.849976 -0.00207565 0.721705 0.0224386 0.601954 0.0722214C0.482203 0.122004 0.37342 0.196038 0.282079 0.289917C0.190738 0.383796 0.118706 0.495601 0.0702688 0.618679C0.0218318 0.741758 -0.00201954 0.873593 0.000133837 1.00634C0.00228721 1.13909 0.0304014 1.27003 0.0828034 1.39138C0.135205 1.51273 0.210824 1.62201 0.305159 1.7127L15.6736 17.5116L0.305159 33.3071C0.215436 33.3988 0.144232 33.5078 0.0956443 33.6278C0.0470563 33.7479 0.0220426 33.8766 0.0220426 34.0066C0.0220426 34.1367 0.0470563 34.2654 0.0956443 34.3854C0.144232 34.5055 0.215436 34.6145 0.305159 34.7062Z'
            fill='currentColor'
          />
        </svg>
      </CarouselNext>

      {/* DOTS */}
      <div className='absolute bottom-[7px] left-1/2 flex -translate-x-1/2 items-center gap-1'>
        {Array.from({ length: count }).map((_, index) => {
          const isActive = index === current - 1

          return (
            <button
              key={index}
              onClick={() => api?.scrollTo(index)}
              className={cn(
                'size-2 rounded-full transition-colors duration-300 hover:bg-primary',
                isActive ? 'bg-primary' : 'bg-primary-foreground',
              )}
            />
          )
        })}
      </div>
    </Carousel>
  )
}
