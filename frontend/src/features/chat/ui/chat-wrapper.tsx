import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation, useSearchParams } from 'react-router-dom'

import {
  ChatProvider,
  useChatContext,
} from '@/features/chat/chat-context/chat-context.tsx'
import { useChatList } from '@/features/chat/library/hooks/use-chat-list.tsx'
import { useUserProfile } from '@/entities/user'
import { useMediaQuery } from '@/shared/library/hooks'
import { ChatList } from './chat-list'
import { ChatSearch } from './chat-search'
import { MessageForm } from './message-form'
import { MessageHeader } from './message-header'
import { MessageList } from './message-list'

export const ChatWrapper = () => {
  const location = useLocation()
  const initialRoomId = location.state?.roomId || null
  const initialMobileView = location.state?.mobileView || null
  const isMobile = useMediaQuery('(max-width: 1440px)')
  return (
    <ChatProvider initialRoomId={initialRoomId}>
      <ChatContent isMobile={isMobile} initialMobileView={initialMobileView} />
    </ChatProvider>
  )
}

const ChatContent = ({
  isMobile,
  initialMobileView,
}: {
  isMobile: boolean
  initialMobileView: 'list' | 'chat' | null
}) => {
  const { t } = useTranslation()
  const {
    mobileView,
    setMobileView,
    setCurrentRoomId,
    setSelectedSellerProfile,
  } = useChatContext()
  const { chats, isLoading, error } = useChatList()
  const [searchParams] = useSearchParams()
  const { data: user } = useUserProfile()
  const requestedRoomId = searchParams.get('roomId')

  // Handle initial room selection
  useEffect(() => {
    if (!user?.id || !chats.length) return

    if (requestedRoomId) {
      const foundChat = chats.find(chat => chat.room_id == requestedRoomId)
      if (foundChat) {
        const sellerProfile =
          foundChat.second_user_profile.id === user.id
            ? foundChat.first_user_profile
            : foundChat.second_user_profile
        setSelectedSellerProfile(sellerProfile)
        setCurrentRoomId(foundChat.room_id)
      }
    } else {
      // Default to first chat if no room selected
      const firstChat = chats[0]
      setCurrentRoomId(firstChat.room_id)
      const sellerProfile =
        firstChat.second_user_profile.id === user.id
          ? firstChat.first_user_profile
          : firstChat.second_user_profile
      setSelectedSellerProfile(sellerProfile)
    }
  }, [
    chats,
    user?.id,
    requestedRoomId,
    setCurrentRoomId,
    setSelectedSellerProfile,
  ])

  // Mobile view handling
  useEffect(() => {
    if (isMobile && initialMobileView) {
      setMobileView(initialMobileView)
    } else if (!isMobile) {
      setMobileView('chat')
    }
  }, [initialMobileView, isMobile, setMobileView])

  return (
    <div className='flex h-[calc(100dvh-150px)] xl:h-[calc(100vh-100px)]'>
      {(mobileView === 'list' || !isMobile) && (
        <div
          className={`w-full ${!isMobile ? 'max-w-[402px] px-6' : 'px-[10px]'} space-y-6 py-[30px]`}
        >
          <div className='space-y-3'>
            <h2 className='pl-5 text-xl/none font-medium text-gray-950'>
              {t('chat.myMessages')}
            </h2>
            <ChatSearch />
          </div>
          <ChatList chats={chats} isLoading={isLoading} error={error} />
        </div>
      )}

      {(mobileView === 'chat' || !isMobile) && (
        <div className='grid flex-grow grid-rows-[auto_1fr_auto] self-stretch border-x border-x-border'>
          <MessageHeader />
          <MessageList />
          <MessageForm />
        </div>
      )}
    </div>
  )
}
