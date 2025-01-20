import { Outlet } from 'react-router-dom'

import { AccountSidebar } from '@/widgets/account/account-sidebar/account-sidebar.tsx'

export const AccountLayout = () => {
  return (
    <div className='container min-h-[calc(100dvh-80px)] xl:flex xl:min-h-[calc(100dvh-96px)]'>
      <AccountSidebar className='hidden xl:block' />
      <div className='flex-1'>
        <Outlet />
      </div>
    </div>
  )
}
