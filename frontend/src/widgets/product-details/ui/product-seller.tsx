import React from 'react'
import { useTranslation } from 'react-i18next'

import { Product } from '@/entities/product'
import { ArrowIcon } from '@/shared/ui'

export interface SellerProps {
  className?: string
  announcement: {
    seller: string
    sellerRegisteredAt: string
    sellerLastOnline: string
    sellerLogo: string
  }
  product: Product
}

export const ProductSeller: React.FC<SellerProps> = ({
  announcement,
  product,
  className,
}) => {
  const { t } = useTranslation()
  return (
    <div className={className}>
      <div className='flex h-full flex-col gap-6 rounded-[15px] border border-border px-[34px] py-6'>
        <h3 className='font-semibold uppercase leading-none'>
          {t('words.seller')}
        </h3>
        <div className='flex flex-row justify-between gap-4'>
          <div className='h-[51px] w-[51px]'>
            <img src={announcement.sellerLogo} alt='Seller Logo' />
          </div>
          <div className='flex flex-col gap-3'>
            <h4 className='text-xl leading-none'>
              {product.seller.first_name}
            </h4>
            <p className='text-primary-gray text-xs leading-none'>
              {t('words.onOKA')}
              {announcement.sellerRegisteredAt}
            </p>
            <p className='text-primary-gray text-xs leading-none'>
              {t('words.online')}
              {announcement.sellerLastOnline}
            </p>
            <button className='mt-2 flex flex-row items-center gap-[9px] text-xs'>
              {t('words.allAdsByAuthor')}
              <ArrowIcon className='w-6 font-bold' />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
