import React from 'react'

import { ProductCarousel } from '@/widgets/product-details/ui/product-carousel.tsx'
import { ProductInfo } from '@/widgets/product-details/ui/product-info.tsx'
import { Product } from '@/entities/product'

interface Props {
  product: Product
  className?: string
  onProductClick: (newSlug: string) => void
}

export const ProductDetails: React.FC<Props> = ({
  product,
  className,
  onProductClick,
}) => {
  return (
    <div className={className}>
      <section className='mt-4 flex flex-col justify-between gap-8 md:mt-[38px] md:gap-10 xl:flex-row'>
        <div className='max-w-[629px] flex-col items-center justify-center'>
          <ProductCarousel product={product} />
        </div>
        <div className='flex w-full flex-col items-start'>
          <ProductInfo
            product={product}
            onProductClick={onProductClick}
            className='w-full'
          />
        </div>
      </section>
    </div>
  )
}
