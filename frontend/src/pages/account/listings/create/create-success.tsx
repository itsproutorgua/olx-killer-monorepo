import React from 'react'
import { useTranslation } from 'react-i18next'
import { Link, Navigate, useLocation } from 'react-router-dom'

import { LoginButton } from '@/features/product'
import {
  FacebookSolidIcon,
  InstagramSolidIcon,
  SearchIconListingSuccess,
  SettingsListingSuccessIcon,
  SuccessIcon,
  TrendArrowIcon,
} from '@/shared/ui/icons'
import { PRIVATE_PAGES } from '@/shared/constants'
import { cn } from '@/shared/library/utils'

interface Props {
  className?: string
}

export const CreateSuccess: React.FC<Props> = ({ className }) => {
  const { t } = useTranslation()
  const location = useLocation()

  // Check if navigation state contains submission confirmation
  if (!location.state?.fromFormSubmission) {
    return <Navigate to={PRIVATE_PAGES.LISTING_CREATE} replace />
  }

  return (
    <div
      className={cn(
        className,
        'container flex h-[calc(100vh-80px)] flex-col items-center pt-[60px] md:pt-[104px] xl:h-[calc(100vh-96px)]',
      )}
    >
      <div className='flex flex-col items-center gap-10 text-black'>
        <div className='flex w-full flex-col items-center gap-5 md:w-[605px]'>
          <SuccessIcon />
          <h1 className='text-center text-[32px] font-medium leading-[38px] text-gray-900'>
            {t('title.listingCreatedSuccess')}
          </h1>
          <p className='w-[277px] text-center text-sm leading-[20px] text-gray-500 md:w-full'>
            {t('listings.createdThanksMessage')}
          </p>
        </div>
        <div className='flex flex-col gap-4 rounded-[15px] border border-gray-200 px-6 py-10 text-gray-500'>
          <h3 className='mb-1 font-semibold text-gray-950'>
            {t('listings.whatNext.next')}
          </h3>
          <div className='flex gap-[14px] md:items-center'>
            <div className='pt-[3px] md:pt-0'>
              <SearchIconListingSuccess className='h-4 w-4 text-primary-600' />
            </div>
            <p className='text-sm'>{t('listings.whatNext.messageSearch')}</p>
          </div>
          <div className='flex gap-[14px] md:items-center'>
            <div className='pt-[3px] md:pt-0'>
              <TrendArrowIcon className='h-4 w-4 text-primary-600' />
            </div>
            <p className='text-sm'>
              {t('listings.whatNext.messageSocials')}
              <span className='space-x-1 md:space-x-2'>
                <Link to='' className='text-primary-700'>
                  <InstagramSolidIcon className='inline h-5 md:h-[26px]' />
                </Link>
                <Link to='' className='text-primary-700'>
                  <FacebookSolidIcon className='inline h-5 md:h-[26px]' />
                </Link>
              </span>
            </p>
          </div>
          <div className='flex gap-[14px] md:items-center'>
            <div className='pt-[3px] md:pt-0'>
              <SettingsListingSuccessIcon className='h-4 w-4 text-primary-600' />
            </div>
            <p className='text-sm'>
              {t('listings.whatNext.messageEdit')}
              <Link
                to={PRIVATE_PAGES.LISTINGS}
                className='font-bold text-primary-700'
              >
                {t('listings.whatNext.listingsLink')}
              </Link>
            </p>
          </div>
        </div>
        <Link to='/account'>
          <LoginButton onClick={() => {}} text={t('buttons.backToAccount')} />
        </Link>
      </div>
    </div>
  )
}
