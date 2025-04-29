import { Outlet, useLocation } from 'react-router-dom'

import { AccountSidebar } from '@/widgets/account/account-sidebar/account-sidebar.tsx'
import { useMediaQuery } from '@/shared/library/hooks'

export const AccountLayout = () => {
  const location = useLocation()
  const isMobile = useMediaQuery('(max-width: 768px)')
  const isChatPage = location.pathname.includes('/account/chat')

  const shouldApplyContainer = !(isChatPage && isMobile)

  return (
    <div
      className={`${shouldApplyContainer ? 'container' : ''} min-h-[calc(100dvh)] xl:flex xl:min-h-[calc(100dvh-96px)]`}
    >
      <AccountSidebar className='hidden xl:block' />
      <div className='flex-1'>
        <Outlet />
      </div>
    </div>
  )
}
