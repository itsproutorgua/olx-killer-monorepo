import { profileDefault } from '@/shared/assets'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { useChatContext } from '@/features/chat/chat-context/chat-context.tsx'
import { useUserProfile } from '@/entities/user'
import { ScrollArea } from '@/shared/ui/shadcn-ui/scroll-area.tsx'
import { CheckedDoubleIcon } from '@/shared/ui/icons'
import { cn } from '@/shared/library/utils'
import { formatMessageTime } from '@/shared/library/utils/format-message-time.tsx'

export interface Chat {
  first_user_profile: {
    id: number
    picture: string | null
    username: string
  }
  room_id: string
  second_user_profile: {
    id: number
    picture: string | null
    username: string
  }
  last_message: {
    content: string
    created_at: string
    sender: string
    from_this_user: boolean
  } | null
}

export const ChatList = ({
  chats,
  isLoading,
  error,
}: {
  chats: Chat[]
  isLoading: boolean
  error: Error | null
}) => {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()

  const {
    setCurrentRoomId,
    currentRoomId,
    setSelectedSellerProfile,
    setMobileView,
  } = useChatContext()
  const { data: user } = useUserProfile()

  if (isLoading) return <div>{t('chatList.loading')}</div>
  if (error) return <div>{t('chatList.error', { message: error.message })}</div>
  if (!user) return <div>{t('chatList.noUser')}</div>

  const handleChatSelect = (
    roomId: string,
    sellerProfile: { id: number; picture: string | null; username: string },
  ) => {
    setCurrentRoomId(roomId)
    setSelectedSellerProfile(sellerProfile)
    navigate(`/account/chat?roomId=${roomId}`)
    if (window.innerWidth < 1440) {
      setMobileView('chat')
    }
  }

  return (
    <ScrollArea className='h-[calc(100dvh-285px)] flex-grow overflow-y-auto xl:h-[calc(100dvh-230px)]'>
      <ul>
        {chats?.map(chat => {
          const isChatActive = chat.room_id === currentRoomId
          const sellerProfile =
            chat.second_user_profile.id === user?.id
              ? chat.first_user_profile
              : chat.second_user_profile
          const lastMessage = chat.last_message

          return (
            <li
              key={chat.room_id}
              onClick={() => handleChatSelect(chat.room_id, sellerProfile)}
              className='border-b border-b-border py-1 first:pt-0'
            >
              <div
                className={cn(
                  'flex cursor-pointer gap-3 rounded-[10px] p-2.5 xl:max-w-[293px]',
                  isChatActive && 'bg-none xl:bg-primary-50',
                )}
              >
                <img
                  src={sellerProfile.picture || profileDefault}
                  alt={`User ${sellerProfile.id}`}
                  className='size-12 flex-none rounded-full object-cover'
                />
                <div className='my-auto flex-1 items-baseline justify-center space-y-1 xl:max-w-[213px]'>
                  <div className='flex items-baseline justify-between'>
                    <h3 className='text-sm/[21px] font-semibold text-primary-900'>
                      {sellerProfile.username}
                    </h3>
                    <span className='text-[9px] text-gray-500'>
                      {lastMessage
                        ? formatMessageTime(
                            lastMessage.created_at,
                            i18n.language as 'en' | 'uk',
                          )
                        : t('messages.noMessages')}
                    </span>
                  </div>
                  <div className='flex items-center justify-between'>
                    <p className='line-clamp-1 w-[198px] text-xs/[14.52px] text-gray-950'>
                      {lastMessage?.from_this_user &&
                        t('messages.isYou') + ': '}
                      {lastMessage
                        ? lastMessage.content.length > 25
                          ? lastMessage.content.slice(0, 25) + '...'
                          : lastMessage.content
                        : t('messages.noMessages')}
                    </p>
                    {lastMessage && <CheckedDoubleIcon />}
                  </div>
                </div>
              </div>
            </li>
          )
        })}
      </ul>
    </ScrollArea>
  )
}
