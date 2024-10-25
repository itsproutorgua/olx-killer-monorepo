import React from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import { useTranslation } from 'react-i18next'

import { Button } from '@/shared/ui/shadcn-ui/button.tsx'

interface Props {
  className?: string
}

export const LoginCard: React.FC<Props> = ({ className }) => {
  const { loginWithRedirect } = useAuth0()
  const { t } = useTranslation()

  return (
    <div className={className}>
      <div className='flex h-full flex-col rounded-[15px] border border-border px-6 py-[34px]'>
        <div className='flex flex-col justify-between gap-[22px] md:flex-row md:items-center md:gap-[45px]'>
          <div className='flex flex-row items-center gap-[17px]'>
            <div className='flex flex-col gap-3'>
              <h3 className='font-semibold uppercase leading-none'>
                {t('words.yourAccount')}
              </h3>
              <p className='leading-5'>{t('words.loginMessage')}</p>
            </div>
          </div>
          <div className='flex flex-row gap-[14px]'>
            <Button
              className='h-[42px] rounded-[60px] bg-primary-900 px-[45px] py-[13px] text-gray-50 transition-colors duration-300 hover:bg-primary-500 active:bg-primary-600 active:duration-0'
              onClick={() => loginWithRedirect()}
            >
              {t('words.log_in')}
            </Button>
            <button
              className='whitespace-nowrap text-xs transition-colors duration-300 hover:text-primary-500'
              onClick={() => loginWithRedirect()}
            >
              {t('words.createAccount')}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
