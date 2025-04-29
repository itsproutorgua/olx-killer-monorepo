import { profileDefault } from '@/shared/assets'
import { useTranslation } from 'react-i18next'

import { useChatContext } from '@/features/chat/chat-context/chat-context.tsx'
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/shared/ui/shadcn-ui/avatar'
import { PhoneIcon } from '@/shared/ui'
import { ArrowDownSmall } from '@/shared/ui/icons'

export const MessageHeader = () => {
  const { t } = useTranslation()
  const { selectedSellerProfile, setMobileView } = useChatContext()

  return (
    <div className='flex items-center justify-between p-[18px] md:p-6'>
      <div className='flex items-start gap-3'>
        <button
          onClick={() => setMobileView('list')}
          className='my-auto mr-2 block md:hidden'
        >
          <ArrowDownSmall className='rotate-90' />
        </button>

        <Avatar className='h-[52px] w-[52px]'>
          <AvatarImage src={selectedSellerProfile?.picture || profileDefault} />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <div className='space-y-1'>
          <p className='text-sm/[21px] font-semibold text-gray-950'>
            {selectedSellerProfile?.username || 'N/A'}
          </p>
          <p className='flex items-center gap-1.5 text-xs/[14.52px] text-gray-950'>
            <span className='flex size-[18px] items-center justify-center'>
              <span className='flex size-2 rounded-full bg-green' />
            </span>
            <span>{t('chat.status')}</span>
          </p>
        </div>
      </div>
      <button className='flex size-[52px] items-center justify-center rounded-full border border-border text-primary-900'>
        <PhoneIcon />
      </button>
    </div>
  )
}
