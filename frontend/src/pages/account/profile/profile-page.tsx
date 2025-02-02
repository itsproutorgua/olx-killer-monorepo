import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import { ProfileEditForm } from '@/features/account/profile'
import { ChevronLeftIcon } from '@/shared/ui'
import { PRIVATE_PAGES } from '@/shared/constants'

export const ProfilePage = () => {
  const { t } = useTranslation()
  return (
    <div className='pb-14 pt-[30px] xl:pl-32 xl:pt-[55px]'>
      <Link
        to={PRIVATE_PAGES.ACCOUNT}
        className='mb-[30px] flex items-center gap-3 text-sm/none xl:hidden xl:gap-5 xl:text-base/[19.36px]'
      >
        <ChevronLeftIcon className='' />
        {t('crumb.returnBack')}
      </Link>
      {/*Profile edit form*/}
      <ProfileEditForm />
    </div>
  )
}
