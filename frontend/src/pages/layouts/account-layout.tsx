import { Outlet } from 'react-router-dom'

import { AccountSidebar } from '@/widgets/account/account-sidebar/account-sidebar.tsx'

export const AccountLayout = () => {
  return (
    <div className='container flex h-[calc(100vh-80px)] xl:h-[calc(100vh-96px)]'>
      <AccountSidebar />
      <div className='flex-1'>
        <Outlet />
      </div>
    </div>
  )
}
