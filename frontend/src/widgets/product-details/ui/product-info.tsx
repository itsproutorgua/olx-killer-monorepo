import React from 'react'
import sellerLogo from '@/shared/assets/images/seller/seller_logo.png'
import i18n from 'i18next'
import { useTranslation } from 'react-i18next'

import { LoginCard } from '@/widgets/login-card/login-card.tsx'
import { generatePriceString } from '@/widgets/product-card'
import { ContactSellerCard } from '@/widgets/product-details/ui/contact-seller-card.tsx'
import { ProductLocation } from '@/widgets/product-details/ui/product-location.tsx'
import { ProductSeller } from '@/widgets/product-details/ui/product-seller.tsx'
import { AddToFavorite } from '@/features/add-to-favorite'
import { ShowNumber, WriteSeller } from '@/features/product'
import { Product } from '@/entities/product'
import { formatDate } from '@/entities/product/model/product-date.helper.ts'
import { Separator } from '@/shared/ui/shadcn-ui/separator.tsx'
import { FlagIcon } from '@/shared/ui'
import { Rating } from '@/shared/ui/rating-with-stars.tsx'

interface Props {
  product: Product
  className?: string
}

export const ProductInfo: React.FC<Props> = ({ className, product }) => {
  const { t } = useTranslation()

  const announcement = {
    id: '858057687',
    views: '61',
    createdAt: 'August 29, 2024',
    productName: "Basic Comfort Women's T-Shirt",
    type: `${t('words.business')}`,
    state: `${t('words.state')}${t('words.new')}`,
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

  return (
    <div className={className}>
      <p className='text-primary-gray text-xs'>
        {t('words.published')} {formatDate(product.created_at, i18n.language)}
      </p>
      <h1 className='mt-[6px] text-2xl font-medium leading-[1.22] md:text-[32px]'>
        {product.title}
      </h1>
      <div className='mt-[18px] hidden flex-row gap-5 md:flex'>
        <span className='flex h-8 items-center rounded-[6px] border border-border px-[21px] py-2.5 text-xs'>
          {announcement.type}
        </span>
        <span className='flex h-8 items-center rounded-[6px] border border-border px-[21px] py-2.5 text-xs'>
          {announcement.state}
        </span>
      </div>
      <div className='mt-2 leading-none md:mt-[54px] md:hidden'>
        <Rating
          rating={announcement.sellerRating}
          reviews={announcement.reviews}
        />
        <p className='mt-2 text-[13px] leading-5 md:mt-[14px]'>
          {product.description}
        </p>
      </div>
      <div className='mt-[34px] flex items-center justify-between'>
        <p className='text-[28px] font-medium leading-[1.22] md:text-[32px]'>
          {generatePriceString(product.prices)}
        </p>
        <AddToFavorite className='text-xl text-primary-900 md:hidden' />
      </div>
      <div className='mt-[32px] flex w-full flex-col items-center gap-[10px] md:mt-[34px] md:flex-row md:gap-[45px]'>
        <div className='flex w-full flex-col gap-[10px] md:flex-row md:gap-4'>
          <WriteSeller />
          <ShowNumber />
        </div>
        <AddToFavorite className='hidden text-xl text-primary-900 md:block' />
      </div>
      <div className='mt-[54px] hidden max-h-[200px] flex-row gap-5 md:flex'>
        <ProductSeller
          announcement={announcement}
          product={product}
          className='basis-1/2'
        />
        <ProductLocation
          location={product.seller.location}
          className='basis-1/2'
        />
      </div>
      <div className='mt-[54px] hidden leading-none md:block'>
        <h3 className='font-semibold uppercase'>{t('words.description')}</h3>
        <p className='mt-[14px] leading-5'>{product.description}</p>
        <Separator className='border-primary-gray mt-[11px]' />
      </div>
      <div className='text-primary-gray mt-[11px] hidden flex-row items-center justify-between text-xs md:flex'>
        <p>ID: {announcement.id}</p>
        <p>
          {t('words.views')}: {product.views}
        </p>
        <button className='hover:text-destructive text-[#c80000] transition-colors duration-300'>
          <FlagIcon className='mr-1 inline-block' />
          <span>{t('words.report')}</span>
        </button>
      </div>
      <LoginCard className='mt-[28px] md:mt-[54px]' />
      <ContactSellerCard
        announcement={announcement}
        product={product}
        className='mt-5'
      />
    </div>
  )
}
