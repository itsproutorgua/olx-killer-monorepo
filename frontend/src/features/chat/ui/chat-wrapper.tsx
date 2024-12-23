import { useTranslation } from 'react-i18next'

import { ChatList } from './chat-list'
import { ChatSearch } from './chat-search'
import { MessageForm } from './message-form'
import { MessageHeader } from './message-header'
import { MessageList } from './message-list'

export const ChatWrapper = () => {
  const { t } = useTranslation()

  return (
    <div className='flex h-full'>
      <div className='w-[402px] space-y-6 px-6 py-[30px]'>
        <div className='space-y-3'>
          <h2 className='pl-5 text-xl/none font-medium text-gray-950'>
            {t('chat.myMessages')}
          </h2>
          <ChatSearch />
        </div>
        <ChatList />
      </div>
      <div className='grid flex-grow grid-rows-[auto_1fr_auto] self-stretch border-x border-x-border'>
        <MessageHeader />
        <MessageList />
        <MessageForm />
      </div>
    </div>
  )
}
