import { Link } from 'react-router-dom'

import type { CategoryChild } from '@/entities/category'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/shared/ui/shadcn-ui/carousel'
import { PUBLIC_PAGES } from '@/shared/constants'

export const CategoryNavbarSlider = ({ data }: { data: CategoryChild[] }) => {
  return (
    <div className='hidden xl:block xl:pb-[52px]'>
      <div className='relative h-[184px]'>
        <Carousel>
          <CarouselContent className='-ml-[51px]'>
            {data.map(item => {
              const href = `${PUBLIC_PAGES.CATALOG}/${item.path}`

              return (
                <CarouselItem
                  key={item.path}
                  className='min-w-[150px] flex-none pl-[51px]'
                >
                  <Link to={href} className='space-y-[15px]'>
                    {item.img ? (
                      <img
                        src={item.img}
                        alt={item.title}
                        className='block size-[150px] rounded-full object-contain'
                      />
                    ) : (
                      <div className='size-[150px] rounded-full bg-gray-400' />
                    )}

                    <p className='line-clamp-1 w-[150px] text-center text-base/[19px]'>
                      {item.title}
                    </p>
                  </Link>
                </CarouselItem>
              )
            })}
          </CarouselContent>
        </Carousel>
      </div>

      <div className='pt-[38px]'>
        <div className='bg-border ml-auto flex h-px w-[413px] items-center'>
          <div className='bg-primary h-[3px] w-1/12' />
        </div>
      </div>
    </div>
  )
}
