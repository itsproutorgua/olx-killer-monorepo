import { develop_image } from '@/shared/assets'
import { useTranslation } from 'react-i18next'

import { BackToListingsButton } from '@/shared/ui'

export const DevelopmentPage = () => {
  const { t } = useTranslation()
  return (
    <div className='flex w-full flex-col items-center justify-center pt-[120px]'>
      <img
        src={develop_image}
        alt='Page is under development'
        className='h-[182px] xl:h-[224px]'
      />
      <div className='flex flex-col items-center justify-center pt-[46px] text-center text-gray-950 xl:w-[512px]'>
        <h3 className='max-w-[271px] text-[20px] font-medium leading-[26px] xl:max-w-[512px]'>
          {t(`development.title`)}
        </h3>
        <p className='pb-[30px] pt-4 leading-5'>{t(`development.text`)}</p>
        <BackToListingsButton className='mb-[70px] xl:mb-0' />
      </div>
    </div>
  )
}
