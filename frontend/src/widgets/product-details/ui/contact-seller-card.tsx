import React from 'react'
import { useTranslation } from 'react-i18next'

import { SellerProps } from '@/widgets/product-details/ui/product-seller.tsx'
import { WriteSeller } from '@/features/product'

export const ContactSellerCard: React.FC<SellerProps> = ({
  announcement,
  product,
  className,
}) => {
  const { t } = useTranslation()
  return (
    <div className={className}>
      <div className='flex h-full flex-col rounded-[15px] border border-border py-[34px] pl-[34px] pr-12'>
        <h3 className='font-semibold uppercase leading-none'>
          {t('words.contactSeller')}
        </h3>
        <div className='mt-[10px] flex flex-col items-start justify-between gap-[22px] md:mt-7 md:flex-row md:items-center md:gap-1 xl:gap-[22px]'>
          <div className='flex flex-row items-center gap-[17px]'>
            <div className='h-[76px] w-[76px] md:h-14 md:w-14 xl:h-[76px] xl:w-[76px]'>
              <img src={announcement.sellerLogo} alt='Seller Logo' />
            </div>
            <div className='flex flex-col gap-3'>
              <h4 className='leading-none md:text-xl'>
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
            </div>
          </div>
          <WriteSeller className='min-w-full md:min-w-[243px]' />
        </div>
      </div>
    </div>
  )
}
