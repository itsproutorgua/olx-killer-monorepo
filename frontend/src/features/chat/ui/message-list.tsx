import { ScrollArea } from '@/shared/ui/shadcn-ui/scroll-area'
import { cn } from '@/shared/library/utils'
import { MSG_DATA } from '../model/msg.data'
import { ScrollToButton } from './scroll-to-button'

export const MessageList = () => {
  return (
    <ScrollArea
      type='hover'
      className='relative h-full border-y border-y-border bg-gray-100 p-6'
    >
      <ul className='space-y-5'>
        {MSG_DATA.map(msg => (
          <li key={msg.id} className='space-y-2.5'>
            <div
              className={cn(
                'rounded-[10px] px-3.5 py-2 text-sm/[21px] tracking-tight',
                msg.type === 'income'
                  ? 'mr-auto rounded-tl-none bg-background text-gray-950'
                  : 'ml-auto rounded-tr-none bg-primary-500 text-background',
                msg.msg_img ? 'w-[400px]' : 'max-w-[340px]',
              )}
            >
              {msg.msg_img && (
                <img
                  src={msg.msg_img}
                  alt='msg'
                  className='mb-3 w-full rounded-[10px]'
                />
              )}
              <p>{msg.msg}</p>
            </div>
            <p
              className={cn(
                'text-xs/[14.52px] tracking-tight text-primary-400',
                msg.type === 'income' ? 'text-left' : 'text-right',
              )}
            >
              {msg.date}
            </p>
          </li>
        ))}
      </ul>
      <ScrollToButton styles='absolute bottom-6 right-6' />
    </ScrollArea>
  )
}
