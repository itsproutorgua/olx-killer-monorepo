import { Link } from 'react-router-dom'

import type { CategoryChild } from '@/entities/category'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/shared/ui/shadcn-ui/carousel'
import { ChevronRight } from '@/shared/ui/icons'
import { PUBLIC_PAGES } from '@/shared/constants'

export const CategoryNavbarMobile = ({ data }: { data: CategoryChild[] }) => {
  const items = Math.ceil(data.length / 9)
  console.log(items)

  return (
    <Carousel>
      <div className='space-y-4'>
        <CarouselContent className='-ml-5'>
          {Array.from({ length: items }).map((_, idx) => (
            <CarouselItem
              key={idx}
              className='basis-[250px] border-r border-r-border pl-5 pr-5'
            >
              <ul className='space-y-[14px]'>
                {data.slice(idx * 9, (idx + 1) * 9).map(item => {
                  const href = `${PUBLIC_PAGES.CATALOG}/${item.path}`

                  return (
                    <li key={item.path} className='text-sm font-medium'>
                      {item.title.length > 20 ? (
                        <Link to={href} className='flex gap-1'>
                          <span className='line-clamp-1'>{item.title}</span>
                          <span>({item.products_cumulative_count})</span>
                        </Link>
                      ) : (
                        <Link to={href}>
                          {item.title} ({item.products_cumulative_count})
                        </Link>
                      )}
                    </li>
                  )
                })}
              </ul>
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className='flex w-full justify-between'>
          <CarouselPrevious className='static m-4 flex size-7 translate-y-0 rotate-180 items-center justify-center border-none bg-primary-900 text-white !opacity-100 disabled:bg-gray-200'>
            <ChevronRight />
          </CarouselPrevious>
          <CarouselNext className='static m-4 flex size-7 translate-y-0 items-center justify-center border-none bg-primary-900 text-white !opacity-100 disabled:bg-gray-200'>
            <ChevronRight />
          </CarouselNext>
        </div>
      </div>
    </Carousel>
  )
}
