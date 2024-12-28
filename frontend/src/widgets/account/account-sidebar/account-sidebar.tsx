import { useAuth0 } from '@auth0/auth0-react'
import { useTranslation } from 'react-i18next'
import { Link, useLocation } from 'react-router-dom'

import { ArrowLeftRed } from '@/shared/ui/icons/arrow-left-red.tsx'
import { SIDEBAR_ITEMS } from '@/shared/constants/account-sidebar.const.ts'

export const AccountSidebar = () => {
  const location = useLocation()
  const activeTab = SIDEBAR_ITEMS.find(item =>
    location.pathname.endsWith(item.url),
  )?.title
  const { t } = useTranslation()
  const { logout } = useAuth0()

  return (
    <aside className='w-[305px] shrink-0 border-r'>
      <nav className='space-y-[10px] border-b pb-[30px] pr-[49px] pt-[42px]'>
        {SIDEBAR_ITEMS.map(item => (
          <button
            key={item.title}
            className={`h-[42px] w-full rounded-xl pl-[18px] ${
              activeTab === item.title
                ? 'bg-primary-500 text-gray-50'
                : 'text-gray-950'
            }`}
          >
            <Link
              to={item.url}
              className='flex items-center gap-2 text-sm font-[500]'
            >
              {activeTab === item.title ? (
                <item.icon.solid />
              ) : (
                <item.icon.outline />
              )}
              {t(`${item.title}`)}
            </Link>
          </button>
        ))}
      </nav>
      <button
        onClick={() => logout()}
        className='mt-[30px] flex h-8 w-full items-center gap-[17px] pl-[18px] text-left text-sm text-error-700'
      >
        <ArrowLeftRed />
        {t('account.logOut')}
      </button>
    </aside>
  )
}
