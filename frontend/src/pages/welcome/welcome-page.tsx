import React from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import { useTranslation } from 'react-i18next'

import { LoginButton } from '@/features/product'
import { PageLoader } from '@/shared/ui'
import { cn } from '@/shared/library/utils'

interface Props {
  className?: string
}

export const WelcomePage: React.FC<Props> = ({ className }) => {
  const { loginWithRedirect, isLoading } = useAuth0()
  const { t } = useTranslation()

  if (isLoading) {
    return <PageLoader />
  }

  return (
    <div
      className={cn(
        className,
        'container flex h-[calc(100vh-80px)] flex-col items-center justify-center xl:h-[calc(100vh-96px)]',
      )}
    >
      <div className='-mt-36 flex flex-col items-center justify-center gap-4'>
        <h1 className='text-[32px] font-semibold leading-none'>
          {t('account.welcome')}
        </h1>
        <p className='mb-[14px] w-[275px] text-center leading-none'>
          {t('account.welcomeMessage')}
        </p>
        <LoginButton
          onClick={() => loginWithRedirect()}
          text={t('buttons.loginOrCreate')}
        />
      </div>
    </div>
  )
}
