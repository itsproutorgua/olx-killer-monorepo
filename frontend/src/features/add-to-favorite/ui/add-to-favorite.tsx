import React, { useEffect, useMemo, useState } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import toast from 'react-hot-toast'

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
  const { isAuthenticated } = useAuth0()
  const { data: favorites, isSuccess } = useFavorites()
  const { addToFavorites, removeFromFavorites } = useFavoriteMutations()

  const favoriteProductIds = useMemo(
    () => favorites?.map(fav => fav.product_details.id) || [],
    [favorites],
  )
  const [isFavorited, setIsFavorited] = useState<boolean | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

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
      toast.error('Please log in to add to favorites')
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
        'group flex size-11 items-center justify-center text-primary-900 transition-colors duration-300',
        className,
      )}
    >
      <HeartIcon
        className={cn(
          'h-6 w-6 transition-colors duration-300',
          isFavorited
            ? 'fill-red-500 stroke-red-500'
            : 'fill-transparent group-hover:fill-primary-900 group-active:fill-primary-600 group-active:stroke-primary-600 group-active:duration-0',
        )}
      />
    </button>
  )
}
