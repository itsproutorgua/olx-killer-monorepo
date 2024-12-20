import { Link } from 'react-router-dom'

import { AddToFavorite } from '@/features/add-to-favorite'
import type { Product } from '@/entities/product'
import { PUBLIC_PAGES } from '@/shared/constants'
import { cn } from '@/shared/library/utils'
import { generatePriceString } from '../library'

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
      className={
        cn(className) + 'h-[224px] w-[173px] xl:h-[348px] xl:w-[305px]'
      }
    >
      <div className='relative mb-[15px] h-[120px] min-w-[173px] overflow-hidden rounded-[15px] bg-gray-300 xl:h-[213px] xl:min-w-[305px]'>
        <img
          src={product.images[0].image}
          alt={product.title}
          className='absolute block h-full w-full object-cover'
        />
        <AddToFavorite
          productId={product.id}
          className='absolute right-0 top-0 xl:hidden'
        />
      </div>
      <p className='mb-[25px] line-clamp-3 text-[13px]/[15.6px] text-foreground xl:mb-9 xl:line-clamp-2 xl:h-[38px] xl:text-base/[19.2px]'>
        {product.description}
      </p>
      <p className='flex items-center justify-between'>
        <span className='text-base/none text-foreground xl:text-2xl/none'>
          {generatePriceString(product.prices)}
        </span>
        <AddToFavorite productId={product.id} className='hidden xl:flex' />
      </p>
    </Link>
  )
}
