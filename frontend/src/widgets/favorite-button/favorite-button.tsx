import { HeartIcon } from '@/shared/ui/icons'
import { cn } from '@/shared/library/utils'

export const FavoriteButton = ({ className }: { className?: string }) => {
  return (
    <button
      className={cn(
        'group flex size-11 items-center justify-center text-gray-50 transition-colors duration-300',
        className,
      )}
    >
      <HeartIcon className='h-6 w-6 fill-primary-900 transition-colors duration-300 group-hover:fill-primary-50' />
    </button>
  )
}
