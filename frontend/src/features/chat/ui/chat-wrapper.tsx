import { useTranslation } from 'react-i18next'
import { useLocation } from 'react-router-dom'

import { ChatProvider } from '@/features/chat/chat-context/chat-context.tsx'
import { ChatList } from './chat-list'
import { ChatSearch } from './chat-search'
import { MessageForm } from './message-form'
import { MessageHeader } from './message-header'
import { MessageList } from './message-list'

export const ChatWrapper = () => {
  const { t } = useTranslation()
  const location = useLocation()
  const initialSellerId = location.state?.sellerId || null

  return (
    <ChatProvider initialSellerId={initialSellerId}>
      <div className='flex h-[calc(100vh-100px)]'>
        <div className='w-[402px] space-y-6 px-6 py-[30px]'>
          <div className='space-y-3'>
            <h2 className='pl-5 text-xl/none font-medium text-gray-950'>
              {t('chat.myMessages')}
            </h2>
            <ChatSearch />
          </div>
          <ChatList initialSellerId={initialSellerId} />
        </div>
        <div className='grid flex-grow grid-rows-[auto_1fr_auto] self-stretch border-x border-x-border'>
          <MessageHeader />
          <MessageList />
          <MessageForm />
        </div>
      </div>
    </ChatProvider>
  )
}
