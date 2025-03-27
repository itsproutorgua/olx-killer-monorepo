import { useEffect, useRef } from 'react'
import { EyeIcon } from 'lucide-react'

import { useChat } from '@/features/chat/library/hooks/use-chat.tsx'
import { useUserProfile } from '@/entities/user'
import { ScrollArea } from '@/shared/ui/shadcn-ui/scroll-area'
import { cn } from '@/shared/library/utils'

export const MessageList = ({ sellerId }: { sellerId: number }) => {
  const { messages } = useChat(sellerId)
  const { data: user } = useUserProfile()
  const scrollRef = useRef<HTMLDivElement | null>(null)

  // Scroll to the latest message whenever messages change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  return (
    <ScrollArea
      ref={scrollRef}
      className='relative h-full flex-grow overflow-y-auto border-y border-y-border bg-gray-100 p-6'
    >
      <ul className='space-y-5'>
        {messages.map(msg => (
          <li
            key={`${msg.message_id}-${msg.created_at}`}
            className='space-y-2.5'
          >
            <div
              className={cn(
                'rounded-[10px] px-3.5 py-2 text-sm/[21px] tracking-tight',
                msg.sender_id === user?.id
                  ? 'ml-auto rounded-tr-none bg-primary-500 text-background'
                  : 'mr-auto rounded-tl-none bg-background text-gray-950',
              )}
            >
              <p>{msg.text}</p>
              <div className='mt-2 flex items-center justify-end gap-2'>
                <span className='text-xs text-opacity-80'>
                  {new Date(msg.created_at).toLocaleTimeString()}
                </span>
                {msg.status === 'read' && <EyeIcon className='h-4 w-4' />}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </ScrollArea>
  )
}
