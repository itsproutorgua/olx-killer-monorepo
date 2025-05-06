import { profileDefault } from '@/shared/assets'

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
  const {
    setCurrentRoomId,
    currentRoomId,
    setSelectedSellerProfile,
    setMobileView,
  } = useChatContext()
  const { data: user } = useUserProfile()

  if (isLoading) return <div>Loading user data...</div>
  if (error) return <div>Error loading user: {error.message}</div>
  if (!user) return <div>No user data available. Please log in.</div>

  const handleChatSelect = (
    roomId: string,
    sellerProfile: { id: number; picture: string | null; username: string },
  ) => {
    setCurrentRoomId(roomId)
    setSelectedSellerProfile(sellerProfile)
    if (window.innerWidth < 1440) {
      setMobileView('chat') // switch to chat view on mobile
    }
  }

  return (
    <ScrollArea className='h-[calc(100dvh-285px)] flex-grow overflow-y-auto xl:h-[calc(100dvh-230px)]'>
      <ul>
        {chats?.map(chat => {
          const isChatActive = chat.room_id == currentRoomId
          const sellerProfile =
            chat.second_user_profile.id === user?.id
              ? chat.first_user_profile
              : chat.second_user_profile
          const lastMessage = chat.last_message

          return (
            <li
              key={chat.room_id}
              onClick={() => handleChatSelect(chat.room_id, sellerProfile)}
              className='border-b border-b-border py-4 first:pt-0'
            >
              <div
                className={cn(
                  'flex cursor-pointer gap-3 rounded-[10px] px-5 py-2.5',
                  isChatActive && 'bg-none xl:bg-primary-50',
                )}
              >
                <img
                  src={sellerProfile.picture || profileDefault}
                  alt={`User ${sellerProfile.id}`}
                  className='size-12 flex-none rounded-full object-cover'
                />
                <div className='flex-1 space-y-2'>
                  <div className='flex items-baseline justify-between'>
                    <h3 className='text-sm/[21px] font-semibold text-primary-900'>
                      {sellerProfile.username}
                    </h3>
                    <span className='text-xs/[14.52px] text-gray-500'>
                      {lastMessage
                        ? formatMessageTime(lastMessage.created_at)
                        : 'No messages'}
                    </span>
                  </div>
                  <div className='flex items-center justify-between'>
                    <p className='line-clamp-1 w-[198px] text-xs/[14.52px] text-gray-950'>
                      {lastMessage?.from_this_user && 'You: '}
                      {lastMessage ? lastMessage.content : 'No messages yet'}
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
