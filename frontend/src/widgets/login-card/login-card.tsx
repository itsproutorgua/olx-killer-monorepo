import React from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import { useTranslation } from 'react-i18next'

import { LoginButton } from '@/features/product'

interface Props {
  className?: string
}

export const LoginCard: React.FC<Props> = ({ className }) => {
  const { loginWithRedirect } = useAuth0()
  const { t } = useTranslation()

  return (
    <div className={className}>
      <div className='flex h-full flex-col rounded-[15px] border border-border py-[34px] pl-[34px] pr-[48px]'>
        <div className='flex flex-col justify-between gap-[22px] md:flex-row md:items-center md:gap-[45px]'>
          <div className='flex flex-row items-center gap-[17px]'>
            <div className='flex flex-col gap-3'>
              <h3 className='font-semibold uppercase leading-none'>
                {t('words.yourAccount')}
              </h3>
              <p className='leading-5'>{t('words.loginMessage')}</p>
            </div>
          </div>

          <LoginButton
            onClick={() =>
              loginWithRedirect({
                appState: { targetUrl: window.location.pathname },
              })
            }
          />
        </div>
      </div>
    </div>
  )
}
