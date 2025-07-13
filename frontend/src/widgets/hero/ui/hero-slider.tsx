import { useEffect, useRef, useState } from 'react'

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from '@/shared/ui/shadcn-ui/carousel.tsx'
import { cn } from '@/shared/library/utils'
import { HERO_DATA } from '../mock/hero.mock'

export const HeroSlider = () => {
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)
  const [count, setCount] = useState(0)
  const carouselRef = useRef<HTMLDivElement>(null)
  const [isVisibleOnScreen, setIsVisibleOnScreen] = useState(false)
  const [isTabActive, setIsTabActive] = useState(
    document.visibilityState === 'visible',
  )
  const shouldAutoscroll = isVisibleOnScreen && isTabActive

  // Observe visibility
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisibleOnScreen(entry.isIntersecting)
      },
      { threshold: 0.5 },
    )

    const node = carouselRef.current
    if (node) observer.observe(node)
    return () => {
      if (node) observer.unobserve(node)
    }
  }, [])

  // Visibility change listener for tab switch
  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsTabActive(document.visibilityState === 'visible')
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [])

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

  // Autoscroll
  useEffect(() => {
    if (!api || !shouldAutoscroll) return

    const interval = setInterval(() => {
      api.scrollNext()
    }, 7000)

    return () => clearInterval(interval)
  }, [api, shouldAutoscroll])

  return (
    <Carousel
      ref={carouselRef}
      setApi={setApi}
      opts={{
        align: 'start',
        loop: true,
      }}
      className='max-w-[630px] rounded-[15px]'
    >
      <CarouselContent>
        {HERO_DATA.map(item => (
          <CarouselItem key={item.id}>
            <img
              src={item.src}
              alt={item.alt}
              width='630'
              height='329'
              className='max-h-[329px] rounded-[15px]'
            />
          </CarouselItem>
        ))}
      </CarouselContent>

      {/* BUTTONS */}
      <CarouselPrevious
        variant={null}
        size={null}
        className='left-[10px] text-gray-50 xl:left-[22px]'
      >
        <svg
          width='24'
          height='24'
          viewBox='0 0 24 24'
          className='fill-gray-200 opacity-70 transition-colors duration-300 hover:fill-primary-300 active:fill-primary-900 active:duration-0'
          xmlns='http://www.w3.org/2000/svg'
        >
          <path
            fillRule='evenodd'
            clipRule='evenodd'
            d='M12 24C18.6274 24 24 18.6274 24 12C24 5.37258 18.6274 0 12 0C5.37258 0 0 5.37258 0 12C0 18.6274 5.37258 24 12 24ZM14.4364 7.7636C14.7879 8.11508 14.7879 8.68493 14.4364 9.0364L11.4728 12L14.4364 14.9636C14.7879 15.3151 14.7879 15.8849 14.4364 16.2364C14.0849 16.5879 13.5151 16.5879 13.1636 16.2364L9.5636 12.6364C9.21213 12.2849 9.21213 11.7151 9.5636 11.3636L13.1636 7.7636C13.5151 7.41213 14.0849 7.41213 14.4364 7.7636Z'
          />
        </svg>
      </CarouselPrevious>
      <CarouselNext
        variant={null}
        size={null}
        className='text-primary-foreground right-[10px] xl:right-[22px]'
      >
        <svg
          width='24'
          height='24'
          viewBox='0 0 24 24'
          className='fill-gray-200 opacity-70 transition-colors duration-300 hover:fill-primary-300 active:fill-primary-900 active:duration-0'
          xmlns='http://www.w3.org/2000/svg'
        >
          <path
            fillRule='evenodd'
            clipRule='evenodd'
            d='M12 24C18.6274 24 24 18.6274 24 12C24 5.37258 18.6274 0 12 0C5.37258 0 0 5.37258 0 12C0 18.6274 5.37258 24 12 24ZM9.5636 7.7636C9.91508 7.41213 10.4849 7.41213 10.8364 7.7636L14.4364 11.3636C14.7879 11.7151 14.7879 12.2849 14.4364 12.6364L10.8364 16.2364C10.4849 16.5879 9.91508 16.5879 9.5636 16.2364C9.21213 15.8849 9.21213 15.3151 9.5636 14.9636L12.5272 12L9.5636 9.0364C9.21213 8.68493 9.21213 8.11508 9.5636 7.7636Z'
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
                'size-2 rounded-full transition-colors duration-300 hover:bg-primary-500 active:fill-primary-500 active:duration-0',
                isActive ? 'bg-primary-900' : 'bg-gray-50',
              )}
            />
          )
        })}
      </div>
    </Carousel>
  )
}
