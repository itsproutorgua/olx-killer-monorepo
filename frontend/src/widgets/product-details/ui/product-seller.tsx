import React from 'react'
import { profileDefault } from '@/shared/assets'
import { format } from 'date-fns'
import { enGB } from 'date-fns/locale'
import { useTranslation } from 'react-i18next'

import { Product } from '@/entities/product'
import { ArrowIcon } from '@/shared/ui'
import {
  formatLastOnline,
  localeMap,
} from '@/shared/library/utils/reformat-time.ts'

export interface SellerProps {
  className?: string
  product: Product
}

export const ProductSeller: React.FC<SellerProps> = ({
  product,
  className,
}) => {
  const { t, i18n } = useTranslation()
  const currentLocale =
    localeMap[i18n.language as keyof typeof localeMap] || enGB
  return (
    <div className={className}>
      <div className='flex h-full flex-col gap-6 rounded-[15px] border border-border px-[24px] py-6'>
        <h3 className='font-semibold uppercase leading-none'>
          {t('words.seller')}
        </h3>
        <div className='flex flex-row gap-4'>
          <div className='h-[51px] w-[51px]'>
            <img
              src={product.seller.picture_url || profileDefault}
              alt={`Logo of ${product?.seller?.first_name ?? 'Product Name'}`}
              className='rounded-full'
            />
          </div>
          <div className='flex flex-col gap-3'>
            <h4 className='text-xl leading-none'>
              {product?.seller?.first_name ?? product?.seller?.username}
            </h4>
            <p className='text-xs leading-none text-gray-400'>
              {t('words.onOKL')}
              {format(product.seller.created_at, 'MMMM yyyy', {
                locale: currentLocale,
              })}
            </p>
            <p className='text-xs leading-none text-gray-400'>
              {t('words.online')}
              {formatLastOnline(product?.seller?.last_login)}
            </p>
            <button
              onClick={() => {
                const target = document.getElementById('productsBySeller')
                if (target) {
                  target.scrollIntoView({ behavior: 'smooth' })
                }
              }}
              className='mt-2 flex flex-row items-center gap-[9px] text-xs'
            >
              {t('words.allAdsByAuthor')}
              <ArrowIcon className='w-6 font-bold' />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
