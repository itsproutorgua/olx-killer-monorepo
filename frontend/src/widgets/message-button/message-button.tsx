import { useNotificationContext } from '@/shared/notifications-context/use-notification-context.ts'
import { Link } from 'react-router-dom'

import { ChatIcon } from '@/shared/ui/icons'
import { PRIVATE_PAGES } from '@/shared/constants'
import { cn } from '@/shared/library/utils'

export const MessageButton = ({ className }: { className?: string }) => {
  const { unreadTotal, isConnected } = useNotificationContext()

  return (
    <Link
      to={`${PRIVATE_PAGES.CHAT}`}
      className={cn(
        'group relative flex size-11 -translate-x-0.5 translate-y-[1px] items-center justify-center text-gray-50 transition-colors duration-300',
        className,
      )}
    >
      <ChatIcon className='h-6 w-6 fill-primary-900 transition-colors duration-300 group-hover:fill-primary-50' />
      {isConnected && unreadTotal > 0 && (
        <span className='absolute right-0 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-gray-50 text-xs text-primary-900'>
          {unreadTotal}
        </span>
      )}
    </Link>
  )
}
