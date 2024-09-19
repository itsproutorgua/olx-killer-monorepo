import React from 'react'
import { Banner } from '@/shared/assets'
import { useTranslation } from 'react-i18next'

import { Button } from '@/shared/ui/shadcn-ui/button'
import { LongArrowAltRightIcon } from '@/shared/ui'

export const PromoSection: React.FC = () => {
  const { t } = useTranslation()
  return (
    <section className='container relative pt-[170px] xl:pt-[138px]'>
      <img src={Banner} alt='Laptop' className='hidden w-full xl:block' />
      <div className='flex flex-col items-center justify-center gap-[18px] text-center xl:container xl:absolute xl:bottom-0 xl:left-0 xl:block xl:w-[600px] xl:text-left'>
        <h2 className='mb-8 text-4xl font-medium text-foreground md:w-full xl:text-5xl'>
          {t('titles.sellPromoTitle')}
        </h2>
        <Button
          size='lg'
          className='h-[53px] rounded-[60px] p-[5px] pl-[37px] leading-none'
        >
          {t('buttons.registerAsSeller')}
          <span className='ml-6 flex size-[43px] items-center justify-center rounded-full bg-background text-primary'>
            <LongArrowAltRightIcon />
          </span>
        </Button>
      </div>
    </section>
  )
}
