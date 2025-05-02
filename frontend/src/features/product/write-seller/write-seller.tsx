import React from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { useUserProfile } from '@/entities/user'
import { useIdToken } from '@/entities/user/library/hooks/use-id-token.tsx'
import { PenIcon } from '@/shared/ui'

interface Props {
  className?: string
  sellerId: number
  productSlug: string
}

export const WriteSeller: React.FC<Props> = ({
  className,
  sellerId,
  productSlug,
}) => {
  const { isAuthenticated } = useAuth0()
  const { data: user } = useUserProfile()
  const getIdToken = useIdToken()

  const { t } = useTranslation()
  const navigate = useNavigate()
  const isSelf = user?.id === sellerId

  const handleWriteSeller = async () => {
    if (!isAuthenticated) {
      toast.error(`${t('messages.loginToWrite')}`)
      return
    }

    if (isSelf) {
      toast.error(`${t('messages.writeYourself')}`)
      return
    }

    try {
      const token = await getIdToken()
      const response = await fetch(
        `https://api.house-community.site/uk/api/v1/chat/create/?first_profile_id=${user?.id}&second_profile_id=${sellerId}`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )

      if (!response.ok) throw new Error('Failed to create chat')
      const productUrl = `https://app.house-community.site/products/${productSlug}`
      const data = await response.json()
      navigate(`/account/chat?roomId=${data.id}`, {
        state: {
          roomId: data.id,
          mobileView: 'chat',
          prefill: `${productUrl}`,
        },
      })
    } catch (error) {
      toast.error(`${t('messages.errorChatStart')}`)
      console.error(error)
    }
  }

  return (
    <div className={className}>
      <button
        className='relative flex h-[53px] w-[238px] min-w-full items-center justify-center rounded-[60px] bg-primary-900 text-base/4 text-gray-50 transition-colors duration-300 hover:bg-primary-500 active:bg-primary-600 active:duration-0 disabled:bg-gray-300 md:min-w-[238px]'
        onClick={handleWriteSeller}
        disabled={isSelf}
        title={isSelf ? `${t('messages.writeYourself')}` : ''}
      >
        <span className='mr-8'>{t('buttons.writeSeller')}</span>
        <span className='absolute right-[5px] flex size-[43px] items-center justify-center rounded-full bg-background text-foreground'>
          <PenIcon />
        </span>
      </button>
    </div>
  )
}
