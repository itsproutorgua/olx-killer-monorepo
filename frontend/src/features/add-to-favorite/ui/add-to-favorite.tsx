import React, { useEffect, useMemo, useState } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import { useTranslation } from 'react-i18next'

import {
  useFavoriteMutations,
  useFavorites,
} from '@/entities/favorite/library/hooks/use-favorites.tsx'
import { HeartIcon } from '@/shared/ui/icons'
import { cn } from '@/shared/library/utils'

export const AddToFavorite = ({
  productId,
  className,
}: {
  productId: number
  className?: string
}) => {
  const { t } = useTranslation()
  const { isAuthenticated } = useAuth0()
  const { data: favorites, isSuccess } = useFavorites()
  const { addToFavorites, removeFromFavorites } = useFavoriteMutations()

  const favoriteProductIds = useMemo(
    () => favorites?.map(fav => fav.product_details.id) || [],
    [favorites],
  )
  const [isFavorited, setIsFavorited] = useState<boolean | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [showTooltip, setShowTooltip] = useState(false) // Tooltip visibility state

  useEffect(() => {
    if (isSuccess && favoriteProductIds) {
      setIsFavorited(favoriteProductIds.includes(productId))
    }
  }, [isSuccess, favoriteProductIds, productId])

  const handleFavoriteToggle = async (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    event.stopPropagation()
    event.preventDefault()

    if (!isAuthenticated) {
      setShowTooltip(true)
      setTimeout(() => setShowTooltip(false), 2000)
      return
    }

    setIsProcessing(true)
    setIsFavorited(!isFavorited)

    try {
      if (isFavorited) {
        await removeFromFavorites.mutateAsync(productId)
      } else {
        await addToFavorites.mutateAsync(productId)
      }
    } catch (error) {
      setIsFavorited(isFavorited)
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <button
      onClick={handleFavoriteToggle}
      disabled={isProcessing}
      className={cn(
        'group relative flex size-11 items-center justify-center text-primary-900 transition-colors duration-300',
        className,
      )}
    >
      <HeartIcon
        className={cn(
          'h-6 w-6 transition-colors duration-300',
          isFavorited
            ? 'fill-primary-600 stroke-primary-600'
            : 'fill-transparent group-hover:stroke-primary-600 group-active:fill-primary-600 group-active:stroke-primary-600 group-active:duration-300',
        )}
      />
      {showTooltip && (
        <div className='absolute -left-[61px] top-2 z-[999] w-[120px] -translate-x-1/2 rounded-md bg-gray-900 px-3 py-2 text-left text-[12px] leading-5 text-gray-50 shadow-lg xl:-top-16 xl:left-1/2 xl:w-[325px] xl:text-sm'>
          {t('buttons.addToFavoritesTooltip')}
          <div className='absolute left-[120px] top-[5px] -rotate-90 border-8 border-x-transparent border-b-transparent border-t-gray-900 xl:left-1/2 xl:top-full xl:-translate-x-1/2 xl:rotate-0' />
        </div>
      )}
    </button>
  )
}
