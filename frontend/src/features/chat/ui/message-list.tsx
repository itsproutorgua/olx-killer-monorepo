import { MouseEvent, useLayoutEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'

import { Message } from '@/features/chat'
import { useChatContext } from '@/features/chat/chat-context/chat-context.tsx'
import { useUserProfile } from '@/entities/user'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/shared/ui/shadcn-ui/dropdown-menu'
import { ScrollArea } from '@/shared/ui/shadcn-ui/scroll-area'
import { CheckedDoubleIcon } from '@/shared/ui/icons'
import { MessageDeliveredIcon } from '@/shared/ui/icons/message-delivered.tsx'
import { useLongPressContextMenu } from '@/shared/library/hooks/use-long-press.ts'
import { cn } from '@/shared/library/utils'
import { formatMessageTime } from '@/shared/library/utils/format-message-time.tsx'
import { linkifyText } from '@/shared/library/utils/linkify-text.tsx'

export const MessageList = () => {
  const { t } = useTranslation()
  const { messages, setEditingMessage, deleteMessage } = useChatContext()
  const { data: user } = useUserProfile()
  const scrollRef = useRef<HTMLDivElement>(null)
  const { isPressing, bind } = useLongPressContextMenu()

  const [contextMenuMessage, setContextMenuMessage] = useState<Message | null>(
    null,
  )
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 })

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

  const handleRightClick = (e: MouseEvent, msg: Message) => {
    if (msg.sender_id !== user?.id) return
    e.preventDefault()
    e.stopPropagation()

    const menuWidth = 160 // Adjust based on your menu width
    const menuHeight = 100 // Adjust based on your menu height

    const x = Math.min(e.clientX, window.innerWidth - menuWidth)
    const y = Math.min(e.clientY, window.innerHeight - menuHeight)

    setContextMenuMessage(msg)
    setMenuPosition({ x, y })
  }

  const closeMenu = () => setContextMenuMessage(null)

  return (
    <>
      <ScrollArea
        ref={scrollRef}
        className='relative h-full flex-grow overflow-y-auto border-y border-y-border bg-gray-100 p-[18px] md:p-6'
      >
        <ul className='space-y-[17px]'>
          {messages.map(msg => (
            <li key={msg.message_id} className='space-y-2.5'>
              <div
                onContextMenu={e => handleRightClick(e, msg)}
                {...bind}
                className={cn(
                  'w-fit min-w-[96px] max-w-[332px] rounded-[10px] px-3.5 py-2 text-sm/[21px] tracking-tight',
                  msg.sender_id === user?.id
                    ? 'ml-auto rounded-tr-none bg-primary-500 text-background'
                    : 'mr-auto rounded-tl-none bg-background text-gray-950',
                  isPressing && 'select-none',
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

      {contextMenuMessage && (
        <DropdownMenu open onOpenChange={closeMenu}>
          <DropdownMenuContent
            side='right'
            align='start'
            className='z-50 bg-gray-50'
            style={{
              position: 'fixed',
              top: menuPosition.y,
              left: menuPosition.x,
            }}
          >
            <DropdownMenuItem
              className='cursor-pointer'
              onClick={() => {
                navigator.clipboard
                  .writeText(contextMenuMessage.text)
                  .then(() => toast.success(t('messages.messageCopied')))
                  .catch(() => toast.error(t('messages.messageCopiedError')))
                  .finally(() => closeMenu())
                closeMenu()
              }}
            >
              {t('words.copy')}
            </DropdownMenuItem>
            <DropdownMenuItem
              className='cursor-pointer'
              onClick={() => {
                setEditingMessage(contextMenuMessage)
                closeMenu()
              }}
            >
              {t('words.edit')}
            </DropdownMenuItem>
            <DropdownMenuItem
              className='text-destructive cursor-pointer'
              onClick={() => {
                deleteMessage(contextMenuMessage.message_id)
                closeMenu()
              }}
            >
              {t('buttons.delete')}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </>
  )
}
