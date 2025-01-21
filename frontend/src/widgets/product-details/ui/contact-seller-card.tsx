import React from 'react'
import sellerLogo from '@/shared/assets/images/seller/seller_logo.png'
import { format } from 'date-fns'
import { enGB } from 'date-fns/locale'
import { useTranslation } from 'react-i18next'

import { SellerProps } from '@/widgets/product-details/ui/product-seller.tsx'
import { WriteSeller } from '@/features/product'
import {
  formatLastOnline,
  localeMap,
} from '@/shared/library/utils/reformat-time.ts'

export const ContactSellerCard: React.FC<SellerProps> = ({
  product,
  className,
}) => {
  const { t, i18n } = useTranslation()
  const currentLocale =
    localeMap[i18n.language as keyof typeof localeMap] || enGB
  return (
    <div className={className}>
      <div className='flex h-full flex-col rounded-[15px] border border-border py-[34px] pl-[34px] pr-12'>
        <h3 className='font-semibold uppercase leading-none'>
          {t('words.contactSeller')}
        </h3>
        <div className='mt-[10px] flex flex-col items-start justify-between gap-[22px] md:mt-7 md:flex-row md:items-center md:gap-1 xl:gap-[22px]'>
          <div className='flex flex-row items-center gap-[17px]'>
            <div className='h-[76px] w-[76px] md:h-14 md:w-14 xl:h-[76px] xl:w-[76px]'>
              <img src={sellerLogo} alt='Seller Logo' />
            </div>
            <div className='flex flex-col gap-3'>
              <h4 className='leading-none md:text-xl'>
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
            </div>
          </div>
          <WriteSeller />
        </div>
      </div>
    </div>
  )
}
