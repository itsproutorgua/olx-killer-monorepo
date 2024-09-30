import { Link } from 'react-router-dom'

import { WOMEN_CLOTHING } from '@/entities/category/mock'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/shared/ui/shadcn-ui/carousel'

export const CategorySlider = () => {
  return (
    <div className='hidden xl:block xl:pb-[52px]'>
      <div className='relative h-[184px]'>
        {/* <Carousel className='absolute left-0 top-0 z-10 w-[1356px]'> */}
        <Carousel>
          <CarouselContent className='-ml-[51px]'>
            {WOMEN_CLOTHING.map(item => (
              <CarouselItem
                key={item.label}
                className='min-w-[150px] flex-none pl-[51px]'
              >
                <Link to={item.href} className='space-y-[15px]'>
                  <img
                    src={item.image}
                    alt={item.alt}
                    className='block size-[150px] rounded-full object-contain'
                  />
                  <p className='text-center text-base/[19px]'>{item.label}</p>
                </Link>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>

      <div className='pt-[38px]'>
        <div className='ml-auto flex h-px w-[413px] items-center bg-border'>
          <div className='h-[3px] w-1/12 bg-primary' />
        </div>
      </div>
    </div>
  )
}
