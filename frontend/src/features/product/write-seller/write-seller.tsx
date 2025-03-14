import React from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { PenIcon } from '@/shared/ui'

interface Props {
  className?: string
  sellerId: number
}

export const WriteSeller: React.FC<Props> = ({ className, sellerId }) => {
  const { isAuthenticated } = useAuth0()
  const { t } = useTranslation()
  const navigate = useNavigate()

  const handleWriteSeller = async () => {
    if (!isAuthenticated) {
      toast.error('Please log in to contact the seller')
      return
    }

    try {
      navigate(`/account/chat`, { state: { sellerId } })
    } catch (error) {
      toast.error('Error starting chat. Please try again.')
      console.error(error)
    }
  }

  return (
    <div className={className}>
      <button
        className='relative flex h-[53px] w-[238px] min-w-full items-center justify-center rounded-[60px] bg-primary-900 text-base/4 text-gray-50 transition-colors duration-300 hover:bg-primary-500 active:bg-primary-600 active:duration-0 md:min-w-[238px]'
        onClick={handleWriteSeller}
      >
        <span className='mr-8'>{t('buttons.writeSeller')}</span>
        <span className='absolute right-[5px] flex size-[43px] items-center justify-center rounded-full bg-background text-foreground'>
          <PenIcon />
        </span>
      </button>
    </div>
  )
}
