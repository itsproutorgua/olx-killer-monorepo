import React from 'react'

import { ProductCarousel } from '@/widgets/product-details/ui/product-carousel.tsx'
import { ProductInfo } from '@/widgets/product-details/ui/product-info.tsx'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/shared/ui/shadcn-ui/breadcrumb.tsx'
import { ArrowIcon, HomeIconBreadcrumb } from '@/shared/ui'

interface Props {
  className?: string
}

export const ProductDetails: React.FC<Props> = ({ className }) => {
  return (
    <div className={className}>
      <div className='flex flex-row items-center justify-start gap-2 md:hidden'>
        <BreadcrumbLink href='/'>
          <button className='flex h-6 w-6 items-center justify-center'>
            <ArrowIcon className='rotate-180' />
          </button>
        </BreadcrumbLink>
        <p className='text-[13px]'>Women's T-Shirts</p>
      </div>
      <Breadcrumb className='hidden md:block'>
        <BreadcrumbList className='gap-5 text-[16px] text-foreground'>
          <BreadcrumbItem>
            <BreadcrumbLink href='/'>
              <HomeIconBreadcrumb className='h-6 w-6' />
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href='/category'>Women’s clothing</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href='/sub-category'>
              Women's T-Shirts
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className='text-primary-gray'>
              Basic Comfort Women's T-Shirt
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <section className='mt-4 flex flex-col justify-between gap-8 md:mt-[38px] md:gap-10 xl:flex-row'>
        <div className='max-w-[629px] flex-col items-center justify-center'>
          <ProductCarousel />
        </div>
        <div className='flex w-full flex-col items-start'>
          <ProductInfo className='w-full' />
        </div>
      </section>
    </div>
  )
}
