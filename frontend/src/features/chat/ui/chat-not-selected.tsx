import React from 'react'
import { useTranslation } from 'react-i18next'

import { TwoChatsOutline } from '@/shared/ui/icons'

interface Props {
  className?: string
}

export const ChatNotSelected: React.FC<Props> = ({ className }) => {
  const { t } = useTranslation()
  return (
    <div className={className}>
      <div className='flex flex-col items-center justify-center gap-[30px]'>
        <TwoChatsOutline />
        <h3 className='text-xl font-medium text-gray-950'>
          {t('chat.selectChat')}
        </h3>
      </div>
    </div>
  )
}
