import { cn } from '@/lib/utils'

import { HeartIcon } from '@/shared/ui/icons'

export const AddToFavorite = ({ className }: { className?: string }) => {
  return (
    <button
      className={cn(
        'group flex size-11 items-center justify-center text-primary-900 transition-colors duration-300',
        className,
      )}
    >
      <HeartIcon className='h-6 w-6 fill-transparent transition-colors duration-300 group-hover:fill-primary-900' />
    </button>
  )
}
