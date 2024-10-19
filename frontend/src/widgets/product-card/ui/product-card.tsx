import { Link } from 'react-router-dom'

import { AddToFavorite } from '@/features/add-to-favorite'
import type { Product } from '@/entities/product'
import { PUBLIC_PAGES } from '@/shared/constants'
import { cn } from '@/shared/library/utils'
import { generatePriceString } from '../lib'

export const ProductCard = ({
  product,
  className,
}: {
  product: Product
  className?: string
}) => {
  return (
    <Link
      to={`${PUBLIC_PAGES.PRODUCTS}/${product.slug}`}
      className={cn(className)}
    >
      <div className='relative mb-[15px] h-[120px] w-full overflow-hidden rounded-[15px] bg-gray-300 xl:h-[213px]'>
        <img
          src={product.images[0].image}
          alt={product.title}
          className='absolute block w-full object-cover'
        />
        <AddToFavorite className='absolute right-0 top-0 xl:hidden' />
      </div>
      <p className='mb-[25px] line-clamp-3 h-12 text-[13px]/[15.6px] text-foreground xl:mb-9 xl:line-clamp-2 xl:h-[38px] xl:text-base/[19.2px]'>
        {product.description}
      </p>
      <p className='flex items-center justify-between'>
        <span className='text-base/none text-foreground xl:text-2xl/none'>
          {generatePriceString(product.prices)}
        </span>
        <AddToFavorite className='hidden xl:flex' />
      </p>
    </Link>
  )
}
