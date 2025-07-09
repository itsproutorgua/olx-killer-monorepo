import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import { CreateListingForm } from '@/features/account/listings'
import { ChevronLeftIcon, PageHeading, PageWrapper } from '@/shared/ui'
import { PRIVATE_PAGES } from '@/shared/constants'

export const CreateListingPage = () => {
  const { t } = useTranslation()

  return (
    <PageWrapper className='px-2 md:px-0'>
      <Link
        to={PRIVATE_PAGES.LISTINGS}
        className='mb-[30px] flex items-center gap-3 text-sm/none xl:gap-5 xl:text-base/[19.36px]'
      >
        <ChevronLeftIcon className='' />
        {t('crumb.backToActiveListings')}
      </Link>
      <PageHeading
        title={t('title.listingCreate')}
        className='mb-10 xl:mb-[50px] xl:text-[32px]/[38.73px]'
      />
      <CreateListingForm />
    </PageWrapper>
  )
}
