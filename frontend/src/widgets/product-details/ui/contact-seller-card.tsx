import React from 'react'

import { SellerProps } from '@/widgets/product-details/ui/product-seller.tsx'
import { WriteSeller } from '@/features/product'

export const ContactSellerCard: React.FC<SellerProps> = ({
  announcement,
  className,
}) => {
  return (
    <div className={className}>
      <div className='flex h-full flex-col rounded-[15px] border border-border px-6 py-[34px] pr-11'>
        <h3 className='font-semibold leading-none'>CONTACT THE SELLER</h3>
        <div className='mt-[10px] flex flex-col items-start justify-between gap-[22px] md:mt-7 md:flex-row md:items-center'>
          <div className='flex flex-row items-center gap-[17px]'>
            <div className='h-[76px] w-[76px]'>
              <img src={announcement.sellerLogo} alt='Seller Logo' />
            </div>
            <div className='flex flex-col gap-3'>
              <h4 className='leading-none md:text-xl'>{announcement.seller}</h4>
              <p className='text-primary-gray text-xs leading-none'>
                on OKA since {announcement.sellerRegisteredAt}
              </p>
              <p className='text-primary-gray text-xs leading-none'>
                Online {announcement.sellerLastOnline}
              </p>
            </div>
          </div>
          <WriteSeller className='min-w-full md:min-w-[243px]' />
        </div>
      </div>
    </div>
  )
}
