import React from 'react'
import sellerLogo from '@/shared/assets/images/seller/seller_logo.png'

import { FavoriteButton } from '@/widgets/favorite-button'
import { LoginCard } from '@/widgets/login-card/login-card.tsx'
import { ContactSellerCard } from '@/widgets/product-details/ui/contact-seller-card.tsx'
import { ProductLocation } from '@/widgets/product-details/ui/product-location.tsx'
import { ProductSeller } from '@/widgets/product-details/ui/product-seller.tsx'
import { ShowNumber, WriteSeller } from '@/features/product'
import { Separator } from '@/shared/ui/shadcn-ui/separator.tsx'
import { FlagIcon } from '@/shared/ui'
import { Rating } from '@/shared/ui/rating-with-stars.tsx'

interface Props {
  className?: string
}

const announcement = {
  id: '858057687',
  views: '61',
  createdAt: 'August 29, 2024',
  productName: "Basic Comfort Women's T-Shirt",
  type: 'Business',
  state: 'New',
  price: '650',
  seller: 'Stylishwear',
  sellerRegisteredAt: 'August 2024',
  sellerLastOnline: 'yesterday at 22:09',
  sellerLogo: sellerLogo,
  sellerRating: 4.5,
  reviews: 155,
  location: {
    place: 'Kyiv, Holosiivskyi',
    region: 'Kyiv region',
    fullLocation: 'Kyiv region, Kyiv, Holosiivskyi',
  },
  description:
    "Sell cool women's T-shirt “Basic Comfort”. It is made of 100% cotton, very soft and comfortable. Excellent fit, suitable for everyday wear. Sizes from XS to 2XL. Sell cool women's T-shirt “Basic Comfort”. It is made of 100% cotton, very soft and comfortable. Excellent fit, suitable for everyday wear. Sizes from XS to 2XL.",
}

export const ProductInfo: React.FC<Props> = ({ className }) => {
  return (
    <div className={className}>
      <p className='text-primary-gray text-xs'>
        Published on {announcement.createdAt}
      </p>
      <h1 className='mt-[6px] text-2xl font-medium leading-[1.22] md:text-[32px]'>
        {announcement.productName}
      </h1>
      <div className='mt-[18px] hidden flex-row gap-5 md:flex'>
        <span className='flex h-8 items-center rounded-[6px] border border-border px-[21px] py-2.5 text-xs'>
          {announcement.type}
        </span>
        <span className='flex h-8 items-center rounded-[6px] border border-border px-[21px] py-2.5 text-xs'>
          State: {announcement.state}
        </span>
      </div>
      <div className='mt-2 leading-none md:mt-[54px] md:hidden'>
        <Rating
          rating={announcement.sellerRating}
          reviews={announcement.reviews}
        />
        <p className='mt-2 text-[13px] leading-5 md:mt-[14px]'>
          {announcement.description}
        </p>
      </div>
      <div className='mt-[34px] flex items-center justify-between'>
        <p className='text-[28px] font-medium leading-[1.22] md:text-[32px]'>
          {announcement.price} UAH
        </p>
        <FavoriteButton className='scale-150 text-xl text-primary md:hidden' />
      </div>
      <div className='mt-[32px] flex w-full flex-col items-center gap-[10px] md:mt-[34px] md:flex-row md:gap-[45px]'>
        <div className='flex w-full flex-col gap-[10px] md:flex-row md:gap-4'>
          <WriteSeller />
          <ShowNumber />
        </div>
        <FavoriteButton className='hidden scale-150 text-xl text-primary md:block' />
      </div>
      <div className='mt-[54px] hidden max-h-[200px] flex-row gap-5 md:flex'>
        <ProductSeller announcement={announcement} className='basis-1/2' />
        <ProductLocation
          location={announcement.location}
          className='basis-1/2'
        />
      </div>
      <div className='mt-[54px] hidden leading-none md:block'>
        <h3 className='font-semibold'>DESCRIPTION</h3>
        <p className='mt-[14px] leading-5'>{announcement.description}</p>
        <Separator className='border-primary-gray mt-[11px]' />
      </div>
      <div className='text-primary-gray mt-[11px] hidden flex-row items-center justify-between text-xs md:flex'>
        <p>ID: {announcement.id}</p>
        <p>Views: {announcement.views}</p>
        <button className='text-[#c80000] transition-colors duration-300 hover:text-destructive'>
          <FlagIcon className='mr-1 inline-block' />
          <span>Report</span>
        </button>
      </div>
      <LoginCard className='mt-[28px] md:mt-[54px]' />
      <ContactSellerCard announcement={announcement} className='mt-5' />
    </div>
  )
}
