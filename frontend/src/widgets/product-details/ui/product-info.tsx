import React from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import i18n from 'i18next'
import { useTranslation } from 'react-i18next'

import { LoginCard } from '@/widgets/login-card/login-card.tsx'
import { generatePriceString } from '@/widgets/product-card'
import { ContactSellerCard } from '@/widgets/product-details/ui/contact-seller-card.tsx'
import { ProductDescription } from '@/widgets/product-details/ui/product-description.tsx'
import { ProductLocation } from '@/widgets/product-details/ui/product-location.tsx'
import { ProductSeller } from '@/widgets/product-details/ui/product-seller.tsx'
import { SimilarProductsSlider } from '@/widgets/similar-products'
import { AddToFavorite } from '@/features/add-to-favorite'
import { WriteSeller } from '@/features/product'
import { Product } from '@/entities/product'
import { formatDate } from '@/entities/product/model/product-date.helper.ts'
import { Separator } from '@/shared/ui/shadcn-ui/separator.tsx'
import { FlagIcon } from '@/shared/ui'

interface Props {
  product: Product
  className?: string
  onProductClick: (newSlug: string) => void
}

export const ProductInfo: React.FC<Props> = ({
  className,
  product,
  onProductClick,
}) => {
  const { isAuthenticated } = useAuth0()
  const { t } = useTranslation()

  const maxClampLength = 200
  const maxClampLengthSmall = 130

  return (
    <div className={className}>
      <p className='text-xs text-gray-400'>
        {t('words.published')} {formatDate(product.created_at, i18n.language)}
      </p>
      <h1 className='mt-[6px] text-2xl font-medium leading-[1.22] md:text-[32px]'>
        {product.title}
      </h1>
      <div className='mt-[18px] hidden flex-row gap-5 md:flex'>
        {/*uncomment when announcement.type will be added*/}
        {/*<span className='flex h-8 items-center rounded-[6px] border border-border px-[21px] py-2.5 text-xs'>*/}
        {/*  {announcement.type}*/}
        {/*</span>*/}
        <span className='flex h-8 items-center rounded-[6px] border border-border px-[21px] py-2.5 text-xs'>
          {t('words.state')}
          {product.status}
        </span>
      </div>
      <div className='mt-2 leading-none md:mt-[54px] md:hidden'>
        <div className='flex items-center text-[12px] text-gray-400'>
          <p>ID: {product?.id}</p>
          <span className='ml-[10px] mt-[1px] border-l border-gray-400 px-[10px] text-xs'>
            {t('words.views')}: {product.views}
          </span>
        </div>
        <span className='mt-[14px] flex h-8 max-w-fit items-center rounded-[6px] border border-border px-[21px] py-2.5 text-xs'>
          {t('words.state')}
          {product.status}
        </span>
        <ProductDescription
          description={product?.description}
          maxClampLength={maxClampLengthSmall}
        />
        <Separator className='mt-[14px] w-full bg-gray-200' />
        <button className='mt-[14px] text-[#B42318]'>
          <FlagIcon className='mr-1 inline-block' />
          <span className='text-[12px]'>{t('words.report')}</span>
        </button>
      </div>
      <div className='mt-[28px] flex items-center justify-between'>
        <p className='text-[28px] font-medium leading-[1.22] md:text-[32px]'>
          {generatePriceString(product.prices)}
        </p>
        <AddToFavorite
          productId={product.id}
          className='text-xl text-primary-900 md:hidden'
        />
      </div>
      <div className='mt-[28px] flex flex-col items-center gap-[10px] md:mt-[34px] md:flex-row md:gap-[45px]'>
        <div className='flex w-full flex-col items-center gap-[10px] md:w-[291px] md:flex-row md:gap-[19px]'>
          <WriteSeller className='w-full md:w-[238px]' />
          <AddToFavorite
            productId={product.id}
            className='hidden h-[34px] w-[34px] text-xl text-primary-900 md:flex md:items-center md:justify-center'
          />
        </div>
      </div>
      <div className='mt-[54px] hidden max-h-[200px] flex-row gap-5 md:flex'>
        <ProductSeller product={product} className='basis-1/2' />
        <ProductLocation
          location={product?.seller.location}
          className='basis-1/2'
        />
      </div>
      <div className='mt-[54px] hidden leading-none md:block'>
        <h3 className='font-semibold uppercase'>{t('words.description')}</h3>
        <ProductDescription
          description={product?.description}
          maxClampLength={maxClampLength}
        />
        <Separator className='mt-[11px] w-full bg-gray-200' />
      </div>
      <div className='mt-[11px] hidden flex-row items-center justify-between text-xs text-gray-400 md:mb-10 md:flex'>
        <p>ID: {product?.id}</p>
        <p>
          {t('words.views')}: {product.views}
        </p>
        <button className='hover:text-destructive text-[#c80000] transition-colors duration-300'>
          <FlagIcon className='mr-1 inline-block' />
          <span>{t('words.report')}</span>
        </button>
      </div>
      <div className='mt-10 md:hidden'>
        <SimilarProductsSlider onProductClick={onProductClick} />
      </div>
      <ProductLocation
        location={product.seller.location}
        className='mb-5 mt-[63px] basis-1/2 md:mb-0 md:hidden'
      />
      {!isAuthenticated && <LoginCard className='mt-[28px]' />}
      {isAuthenticated && <ContactSellerCard product={product} />}
    </div>
  )
}
