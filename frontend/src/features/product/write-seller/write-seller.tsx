import React from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'

import { PenIcon } from '@/shared/ui'

interface Props {
  className?: string
}

export const WriteSeller: React.FC<Props> = ({ className }) => {
  const { isAuthenticated } = useAuth0()
  const { t } = useTranslation()
  return (
    <div className={className}>
      <button
        className='relative flex h-[53px] w-[238px] min-w-full items-center justify-center rounded-[60px] bg-primary-900 text-base/4 text-gray-50 transition-colors duration-300 hover:bg-primary-500 active:bg-primary-600 active:duration-0 md:min-w-[238px]'
        onClick={
          isAuthenticated
            ? undefined
            : () => toast.error('Please log in to contact seller')
        }
      >
        <span className='mr-8'>{t('buttons.writeSeller')}</span>
        <span className='absolute right-[5px] flex size-[43px] items-center justify-center rounded-full bg-background text-foreground'>
          <PenIcon />
        </span>
      </button>
    </div>
  )
}
