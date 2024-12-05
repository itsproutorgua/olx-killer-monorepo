import { useAuth0 } from '@auth0/auth0-react'

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
  const { data: favorites } = useFavorites()
  const { addToFavorites, removeFromFavorites } = useFavoriteMutations()
  const favoriteProductIds = favorites?.map(
    favorite => favorite.product_details.id,
  )
  const isFavorited = favoriteProductIds?.includes(productId)

  const handleFavoriteToggle = () => {
    if (!isAuthenticated) {
      alert('Please log in to add to favorites')
      return
    }

    if (isFavorited) {
      removeFromFavorites.mutate(productId)
    } else {
      addToFavorites.mutate(productId)
    }
  }

  return (
    <button
      onClick={handleFavoriteToggle}
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
