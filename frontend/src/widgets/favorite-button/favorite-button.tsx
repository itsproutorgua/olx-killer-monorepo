import { Link } from 'react-router-dom'

import { useFavoriteCount } from '@/entities/favorite/library/hooks/use-favorites.tsx'
import { HeartIcon } from '@/shared/ui/icons'
import { PRIVATE_PAGES } from '@/shared/constants'
import { cn } from '@/shared/library/utils'

export const FavoriteButton = ({ className }: { className?: string }) => {
  const { data: favoriteCount, isLoading } = useFavoriteCount()

  return (
    <Link
      to={`${PRIVATE_PAGES.ACCOUNT}/${PRIVATE_PAGES.FAVORITE}`}
      className={cn(
        'group relative flex size-11 items-center justify-center text-gray-50 transition-colors duration-300',
        className,
      )}
    >
      <HeartIcon className='h-6 w-6 fill-primary-900 transition-colors duration-300 group-hover:fill-primary-50' />
      {/* Favorite Count Badge */}
      {!isLoading && (favoriteCount ?? 0) > 0 && (
        <span className='absolute right-0 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-gray-50 text-xs text-primary-900'>
          {favoriteCount}
        </span>
      )}
    </Link>
  )
}
