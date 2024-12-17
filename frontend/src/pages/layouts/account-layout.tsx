import { Outlet } from 'react-router-dom'

import { AccountSidebar } from '@/widgets/account/account-sidebar/account-sidebar.tsx'

export const AccountLayout = () => {
  return (
    <div className='container flex h-[766px]'>
      <AccountSidebar />
      <main className='flex-1'>
        <Outlet />
      </main>
    </div>
  )
}
