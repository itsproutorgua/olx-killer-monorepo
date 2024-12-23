import { CheckedDoubleIcon } from '@/shared/ui/icons'
import { cn } from '@/shared/library/utils'
import { CHAT_DATA } from '../model/chat.data'

export const ChatList = () => {
  return (
    <ul>
      {CHAT_DATA.map(item => (
        <li key={item.id} className='border-b border-b-border py-4 first:pt-0'>
          <div
            className={cn(
              'flex cursor-pointer gap-3 rounded-[10px] px-5 py-2.5',
              item.id === 1 && 'bg-primary-50',
            )}
          >
            <img
              src={item.avatar}
              alt={item.name}
              className='size-12 flex-none rounded-full'
            />
            <div className='flex-1 space-y-2'>
              <div className='flex items-baseline justify-between'>
                <h3 className='text-sm/[21px] font-semibold text-primary-900'>
                  {item.name}
                </h3>
                <span className='text-xs/[14.52px] text-gray-500'>
                  {item.date}
                </span>
              </div>
              <div className='flex items-center justify-between'>
                <p className='line-clamp-1 w-[198px] text-xs/[14.52px] text-gray-950'>
                  {item.msg}
                </p>
                {item.msg_count === 0 ? (
                  <CheckedDoubleIcon />
                ) : (
                  <span className='flex size-[17px] items-center justify-center rounded-full bg-primary-900 text-[8px]/none text-gray-50'>
                    {item.msg_count}
                  </span>
                )}
              </div>
            </div>
          </div>
        </li>
      ))}
    </ul>
  )
}
