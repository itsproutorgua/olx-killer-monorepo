import React from 'react'
import { Banner } from '@/shared/assets'
import { useAuth0 } from '@auth0/auth0-react'
import { useTranslation } from 'react-i18next'

import { Button } from '@/shared/ui/shadcn-ui/button'
import { LongArrowAltRightIcon } from '@/shared/ui'

export const PromoSection: React.FC = () => {
  const { loginWithRedirect } = useAuth0()
  const { t } = useTranslation()
  return (
    <section className='container relative pt-[158px] xl:pt-[100px]'>
      <img src={Banner} alt='Laptop' className='hidden w-full xl:block' />
      <div className='flex flex-col items-center justify-center gap-[18px] text-center xl:container xl:absolute xl:bottom-0 xl:left-0 xl:block xl:w-[600px] xl:text-left'>
        <h2 className='mb-8 text-4xl font-medium text-gray-900 md:w-full xl:text-5xl'>
          {t('title.sellPromoTitle')}
        </h2>
        <Button
          className='h-[53px] rounded-[60px] bg-primary-900 p-[5px] pl-[37px] text-[13px] leading-none text-gray-50 transition-colors duration-300 hover:bg-primary-500 active:bg-primary-600 active:text-gray-50 active:duration-0 xl:text-base'
          onClick={() =>
            loginWithRedirect({
              appState: { targetUrl: window.location.pathname },
            })
          }
        >
          {t('buttons.registerAsSeller')}
          <span className='ml-6 flex size-[43px] items-center justify-center rounded-full bg-gray-50 text-primary-900'>
            <LongArrowAltRightIcon />
          </span>
        </Button>
      </div>
    </section>
  )
}
