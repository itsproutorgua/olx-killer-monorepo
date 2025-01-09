import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import { Listing } from '@/entities/user-listings/models/types.ts'
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
        'flex h-[161px] w-[898px] items-center justify-between rounded-lg p-4',
        className,
      )}
    >
      <Link to={`${PUBLIC_PAGES.PRODUCTS}/${product.slug}`} className='flex'>
        <div className='h-[129px] w-[217px] overflow-hidden rounded-lg'>
          <img
            src={product.images[0]?.image}
            alt={product.title}
            className='h-full w-full object-cover'
          />
        </div>

        <div className='ml-5 flex h-full max-w-[306px] flex-col items-start gap-6 text-gray-900'>
          <h2 className='text-sm'>{product.title}</h2>
          <p className='text-[20px]'>{generatePriceString(product.prices)}</p>
          {!product.active && (
            <div className='flex h-[30px] items-center gap-[10px] rounded bg-error-300 px-3 py-[6px] text-xs'>
              <XCircleSmall />
              {t('user-listings.listingInactive')}
            </div>
          )}
        </div>
      </Link>

      <div className='flex h-full flex-col items-start'>
        <div className='flex flex-row items-start gap-[22px] text-[14px]'>
          <button
            onClick={onEdit}
            className='flex gap-3 text-gray-900 hover:text-primary-600'
          >
            <EditSmall />
            {t('words.edit')}
          </button>
          <button
            onClick={onDelete}
            className='flex gap-3 text-error-700 hover:text-error-500'
          >
            <DeleteSmall />
            {t('words.delete')}
          </button>
        </div>
      </div>
    </div>
  )
}
