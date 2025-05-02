import { useLayoutEffect, useRef } from 'react'

import { useChatContext } from '@/features/chat/chat-context/chat-context.tsx'
import { useUserProfile } from '@/entities/user'
import { ScrollArea } from '@/shared/ui/shadcn-ui/scroll-area'
import { CheckedDoubleIcon } from '@/shared/ui/icons'
import { MessageDeliveredIcon } from '@/shared/ui/icons/message-delivered.tsx'
import { cn } from '@/shared/library/utils'
import { formatMessageTime } from '@/shared/library/utils/format-message-time.tsx'
import { linkifyText } from '@/shared/library/utils/linkify-text.tsx'

export const MessageList = () => {
  const { messages } = useChatContext()
  const { data: user } = useUserProfile()
  const scrollRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    if (scrollRef.current) {
      const scrollContainer = scrollRef.current.querySelector(
        '[data-radix-scroll-area-viewport]',
      )

      if (scrollContainer) {
        scrollContainer.scrollTo({
          top: scrollContainer.scrollHeight,
          behavior: 'instant',
        })
      }
    }
  }, [messages])

  return (
    <ScrollArea
      ref={scrollRef}
      className='relative h-full flex-grow overflow-y-auto border-y border-y-border bg-gray-100 p-[18px] md:p-6'
    >
      <ul className='space-y-[17px]'>
        {messages.map(msg => (
          <li
            key={`${msg.message_id}-${msg.created_at}`}
            className='space-y-2.5'
          >
            <div
              className={cn(
                'w-fit min-w-[96px] max-w-[332px] rounded-[10px] px-3.5 py-2 text-sm/[21px] tracking-tight',
                msg.sender_id === user?.id
                  ? 'ml-auto rounded-tr-none bg-primary-500 text-background'
                  : 'mr-auto rounded-tl-none bg-background text-gray-950',
              )}
            >
              <p className='whitespace-pre-wrap break-words'>
                {linkifyText(msg.text)}
              </p>
            </div>
            <div
              className={cn(
                'flex items-center gap-2 text-primary-400',
                msg.sender_id === user?.id ? 'justify-end' : 'justify-start',
              )}
            >
              <span className='text-xs text-opacity-80'>
                {formatMessageTime(msg.created_at)}
              </span>
              {msg.sender_id === user?.id && msg.status === 'read' && (
                <CheckedDoubleIcon className='h-4 w-4' />
              )}
              {msg.sender_id === user?.id && msg.status === 'delivered' && (
                <MessageDeliveredIcon className='h-4 w-4' />
              )}
            </div>
          </li>
        ))}
      </ul>
    </ScrollArea>
  )
}
