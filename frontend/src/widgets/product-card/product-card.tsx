import React from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import type { BestDeal } from '@/entities/product'
import { HeartIcon, Picture } from '@/shared/ui'
import { PUBLIC_PAGES } from '@/shared/constants'
import { cn } from '@/shared/lib/utils'

interface ItemCardProps {
  image: BestDeal['image']
  description: string
  price: string
  className?: string
}

export const ProductCard: React.FC<ItemCardProps> = ({
  image,
  description,
  price,
  className,
}) => {
  const { t } = useTranslation()
  return (
    <div
      className={cn(
        'flex w-[173px] flex-col gap-[15px] xl:w-[305px]',
        className,
      )}
    >
      <Link to={PUBLIC_PAGES.PRODUCT}>
        <div className='relative cursor-pointer'>
          <Picture
            src={image.src}
            alt={image.alt}
            srcset={image.srcset}
            type={image.type}
          />
          <div className='mt-[15px]'>
            <HeartIcon className='absolute right-[10px] top-[7px] xl:hidden' />
            <p className='text-sm text-foreground xl:text-base'>
              {description}
            </p>
          </div>
        </div>
        <div className='mt-[10px] flex h-6 items-center justify-between xl:mt-5'>
          <span className='text-foreground xl:text-2xl'>
            {price} {t('currency')}
          </span>
          <HeartIcon className='hidden cursor-pointer xl:block' />
        </div>
      </Link>
    </div>
  )
}
