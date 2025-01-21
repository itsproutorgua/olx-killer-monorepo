import { useAuth0 } from '@auth0/auth0-react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { AddListingButton } from '@/features/announcement/ui/add-listing-button.tsx'
import { useListingsState } from '@/entities/user-listings/library'
import { ListingsTabs } from '@/entities/user-listings/ui/listings-tabs.tsx'
import { EditProfile } from '@/shared/ui/icons'
import { ArrowDownSmall } from '@/shared/ui/icons/arrow-down-small.tsx'
import { ArrowLeftRed } from '@/shared/ui/icons/arrow-left-red.tsx'

export const AccountPageMobile = () => {
  const { logout } = useAuth0()
  const { t } = useTranslation()
  const { user } = useAuth0()
  const navigate = useNavigate()

  const { activeTab } = useListingsState()

  const handleTabChange = (tabId: string) => {
    navigate('/account/listings' + `?publication_status=${tabId}`)
  }

  return (
    <div className='my-5 mb-16 flex h-full flex-col gap-5'>
      <div className='relative flex flex-col items-center gap-[10px] rounded-[20px] bg-white py-[26px] shadow-sm'>
        <img
          src={user?.picture}
          alt='Profile'
          className='h-[70px] w-[70px] rounded-full object-cover'
        />
        <div className='flex flex-1 flex-col gap-1'>
          <h2 className='font-medium leading-5'>{user?.name}</h2>
          <p className='text-sm font-light'>{user?.email}</p>
        </div>
        <button
          className='absolute right-[18px] top-[18px] h-5 w-5 transition duration-300 hover:text-primary-500'
          aria-label={t('Edit profile')}
        >
          <EditProfile />
        </button>
      </div>
      <AddListingButton />
      <div className='mt-5'>
        <h3 className='mb-2 text-lg font-semibold leading-[18px]'>
          {t('listings.yourListings')}
        </h3>
        <div className='divide-y divide-gray-200'>
          <ListingsTabs activeTab={activeTab} onChangeTab={handleTabChange} />
        </div>
      </div>

      <div className='mt-5'>
        <h3 className='mb-2 text-lg font-semibold leading-[18px]'>
          {t('account.otherSettings')}
        </h3>
        <button
          onClick={() => navigate('/settings')}
          className='flex w-full items-center justify-between border-b border-gray-200 py-[14px] text-start leading-5 hover:cursor-pointer hover:text-primary-500'
        >
          {t('account.settings')}
          <ArrowDownSmall className='-rotate-90' />
        </button>
      </div>

      <button
        onClick={() => logout()}
        className='mt-[10px] flex w-fit cursor-pointer items-center justify-center gap-3 place-self-center py-2 text-sm font-medium leading-none text-error-700'
      >
        <ArrowLeftRed />
        {t('account.logOut')}
      </button>
    </div>
  )
}
