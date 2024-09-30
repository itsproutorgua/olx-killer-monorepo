import React from 'react'

import { ArrowIcon } from '@/shared/ui'

export interface SellerProps {
  className?: string
  announcement: {
    seller: string
    sellerRegisteredAt: string
    sellerLastOnline: string
    sellerLogo: string
  }
}

export const ProductSeller: React.FC<SellerProps> = ({
  announcement,
  className,
}) => {
  return (
    <div className={className}>
      <div className='flex h-full flex-col gap-6 rounded-[15px] border border-border px-[34px] py-6'>
        <h3 className='font-semibold leading-none'>SELLER</h3>
        <div className='flex flex-row justify-between gap-4'>
          <div className='h-[51px] w-[51px]'>
            <img src={announcement.sellerLogo} alt='Seller Logo' />
          </div>
          <div className='flex flex-col gap-3'>
            <h4 className='text-xl leading-none'>{announcement.seller}</h4>
            <p className='text-primary-gray text-xs leading-none'>
              on OKA since {announcement.sellerRegisteredAt}
            </p>
            <p className='text-primary-gray text-xs leading-none'>
              Online {announcement.sellerLastOnline}
            </p>
            <button className='mt-2 flex flex-row items-center gap-[9px] text-xs'>
              All ads by author <ArrowIcon className='w-6 font-bold' />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
