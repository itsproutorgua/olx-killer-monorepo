import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import { ProductStats } from '@/features/product'
import { Listing } from '@/entities/user-listings/models/types.ts'
import { Separator } from '@/shared/ui/shadcn-ui/separator.tsx'
import { DeleteSmall } from '@/shared/ui/icons/delete-small.tsx'
import { EditSmall } from '@/shared/ui/icons/edit-small.tsx'
import { XCircleSmall } from '@/shared/ui/icons/x-circle-small.tsx'
import { PUBLIC_PAGES } from '@/shared/constants'
import { cn } from '@/shared/library/utils'
import { generatePriceString } from '../library'

export const HorizontalProductCard = ({
  product,
  className,
  onEdit,
  onDelete,
}: {
  product: Listing
  className?: string
  onEdit?: () => void
  onDelete?: () => void
}) => {
  const { t } = useTranslation()
  return (
    <div
      className={cn(
        'flex flex-col justify-between rounded-[10px] bg-white p-4 shadow-md xl:h-[161px] xl:w-[932px] xl:flex-row xl:items-center xl:bg-transparent xl:px-0 xl:shadow-none',
        className,
      )}
    >
      <Link
        to={`${PUBLIC_PAGES.PRODUCTS}/${product.slug}`}
        className='mb-5 flex'
      >
        <div className='h-[100px] overflow-hidden rounded-lg xl:h-[129px] xl:w-[217px]'>
          <img
            src={product.images[0]?.image}
            alt={product.title}
            className='h-full w-[134px] object-cover xl:w-full'
          />
        </div>

        <div className='ml-5 flex h-full max-w-[306px] flex-col justify-between text-gray-900 xl:h-[129px]'>
          <div className='flex flex-col items-start gap-6'>
            <h2 className='text-xs leading-none xl:text-sm'>{product.title}</h2>
            <p className='leading-5 xl:text-[20px]'>
              {generatePriceString(product.prices)}
            </p>
          </div>
          {product.active && (
            <ProductStats
              messagesCount={12}
              views={product.views}
              likes={12}
              className='mb-0 hidden h-6 w-[200px] text-sm xl:flex'
            />
          )}
          {!product.active && (
            <div className='hidden h-[30px] items-center gap-[10px] rounded bg-error-300 px-3 py-[6px] text-xs xl:flex'>
              <XCircleSmall />
              {t('listings.listingInactive')}
            </div>
          )}
        </div>
      </Link>

      {!product.active && (
        <div className='mb-5 flex h-[30px] w-fit items-center gap-[10px] rounded bg-error-300 px-3 py-[6px] text-xs xl:hidden'>
          <XCircleSmall />
          {t('listings.listingInactive')}
        </div>
      )}

      {product.active && (
        <Separator className='mb-[14px] bg-gray-200 xl:hidden' />
      )}

      {product.active && (
        <ProductStats
          messagesCount={12}
          views={product.views}
          likes={12}
          className='xl:hidden'
        />
      )}

      <div className='flex h-full flex-col xl:items-start'>
        <div className='flex flex-row justify-between gap-[10px] text-[14px] xl:items-start xl:gap-[22px]'>
          <button
            onClick={onEdit}
            className='flex w-full items-center justify-center gap-3 rounded-[6px] border border-gray-200 py-[10px] text-gray-900 hover:text-primary-600 xl:w-[156px]'
          >
            <EditSmall />
            {t('words.edit')}
          </button>
          <button
            onClick={onDelete}
            className='flex w-full items-center justify-center gap-3 rounded-[6px] border border-gray-200 py-[10px] text-error-700 hover:text-error-500 xl:w-[156px]'
          >
            <DeleteSmall />
            {t('words.delete')}
          </button>
        </div>
      </div>
    </div>
  )
}
