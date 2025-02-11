import React from 'react'
import { LoaderCircle } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import { ProductStats } from '@/features/product'
import { useFavoriteMutations } from '@/entities/favorite/library/hooks/use-favorites.tsx'
import { useDeleteProduct } from '@/entities/product/library/hooks/use-delete-product.tsx'
import { Listing } from '@/entities/user-listings/models/types.ts'
import { Separator } from '@/shared/ui/shadcn-ui/separator.tsx'
import { DeleteSmall } from '@/shared/ui/icons/delete-small.tsx'
import { EditSmall } from '@/shared/ui/icons/edit-small.tsx'
import { PUBLIC_PAGES } from '@/shared/constants'
import { cn } from '@/shared/library/utils'
import { generatePriceString, getStatusLabel } from '../library'

export const HorizontalProductCard = ({
  listingStatus,
  product,
  className,
  onEdit,
}: {
  listingStatus?: string
  product: Listing
  className?: string
  onEdit?: () => void
}) => {
  const { t } = useTranslation()
  const statusLabel = getStatusLabel(t, listingStatus)

  const { removeFromFavorites } = useFavoriteMutations()
  const deleteProductMutation = useDeleteProduct()
  const handleRemoveFavorite = async (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    event.stopPropagation()
    event.preventDefault()

    try {
      await removeFromFavorites.mutateAsync(product.id)
    } catch (error) {
      console.log('Error occurred when deleting item from favorite')
    }
  }

  const handleDeleteProduct = async (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    event.stopPropagation()
    event.preventDefault()

    try {
      await deleteProductMutation.mutateAsync(product.slug)
    } catch (error) {
      console.log('Error occurred when deleting product')
    }
  }

  return (
    <div
      className={cn(
        'flex flex-col justify-between rounded-[10px] bg-white p-4 shadow-md xl:h-[161px] xl:w-[932px] xl:flex-row xl:items-center xl:bg-transparent xl:px-0 xl:pr-2 xl:shadow-none',
        className,
      )}
    >
      <Link
        to={`${PUBLIC_PAGES.PRODUCTS}/${product.slug}`}
        className='mb-5 flex xl:mb-0'
      >
        <div className='h-[100px] w-[134px] overflow-hidden rounded-lg xl:h-[129px] xl:w-[217px]'>
          <img
            src={product.images[0]?.image}
            alt={product.title}
            className='h-full w-[134px] object-cover xl:w-full'
          />
        </div>

        <div className='ml-[10px] flex h-full max-w-[180px] flex-col justify-between text-gray-900 md:max-w-[370px] xl:ml-5 xl:h-[129px] xl:max-w-[306px]'>
          <div className='flex flex-col items-start gap-6'>
            <h2 className='text-xs leading-none xl:text-sm'>{product.title}</h2>
            <p className='leading-5 xl:text-[20px]'>
              {generatePriceString(product?.prices) || 'Price unavailable'}
            </p>
          </div>
          {listingStatus === 'active' && (
            <ProductStats
              messagesCount={12}
              views={product.views}
              likes={12}
              className='mb-0 hidden h-6 w-[200px] text-sm xl:flex'
            />
          )}
          {statusLabel && (
            <div
              className={cn(
                'hidden h-[30px] max-w-fit items-center gap-[10px] rounded px-3 py-[6px] text-xs xl:flex',
                statusLabel.className,
              )}
            >
              {statusLabel.icon}
              {statusLabel.label}
            </div>
          )}
        </div>
      </Link>

      {statusLabel && (
        <div
          className={cn(
            'mb-5 flex h-[30px] w-fit items-center gap-[10px] rounded px-3 py-[6px] text-xs xl:hidden',
            statusLabel.className,
          )}
        >
          {statusLabel.icon}
          {statusLabel.label}
        </div>
      )}

      {listingStatus === 'active' && (
        <Separator className='mb-[14px] bg-gray-200 xl:hidden' />
      )}

      {listingStatus === 'active' && (
        <ProductStats
          messagesCount={12}
          views={product.views}
          likes={12}
          className='xl:hidden'
        />
      )}

      <div className='flex h-full flex-col xl:items-start'>
        <div className='flex flex-row justify-between gap-[10px] text-xs xl:items-start xl:gap-[22px]'>
          {listingStatus !== 'Favorite' && (
            <button
              onClick={onEdit}
              className='flex w-full items-center justify-center gap-3 rounded-[6px] border border-gray-200 py-[10px] text-gray-900 hover:text-primary-600 xl:w-[156px]'
            >
              <EditSmall />
              {t('words.edit')}
            </button>
          )}
          <button
            onClick={
              listingStatus === 'Favorite'
                ? handleRemoveFavorite
                : handleDeleteProduct
            }
            className={`flex w-full items-center justify-center gap-3 rounded-[6px] border border-gray-200 py-[10px] text-error-700 hover:text-error-500 ${listingStatus === 'Favorite' ? 'xl:min-w-[219px] xl:px-8' : 'xl:w-[156px]'}`}
          >
            {removeFromFavorites.status === 'pending' ? (
              <LoaderCircle className='size-[18px] animate-spin' />
            ) : (
              <>
                <DeleteSmall />
                {listingStatus === 'active'
                  ? `${t('words.deactivate')}`
                  : listingStatus === 'Favorite'
                    ? `${t('words.delete')} ${t('words.fromFavorite')}`
                    : t('words.delete')}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
