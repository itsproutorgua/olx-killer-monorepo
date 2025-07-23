import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import { ArrowAngled } from '@/shared/ui/icons'

export const AboutUsBanner = () => {
  const { t } = useTranslation()
  return (
    <Link
      to='/about'
      className='flex max-h-[329px] min-h-[158px] w-full max-w-[305px] items-end justify-between rounded-[15px] border border-border/60 bg-primary-100 px-[20px] pb-[19px] pt-[20px]'
    >
      <div className='space-y-[11px]'>
        <h2 className='w-[189px] text-[26px]/[28.6px] font-medium text-primary-800'>
          {t('title.aboutUs')}
        </h2>
        <p className='max-w-[189px] text-[13px]/[15.6px] text-primary-900'>
          {t('aboutUs.bannerText')}
        </p>
      </div>
      <ArrowAngled className='text-primary-800' />
    </Link>
  )
}
