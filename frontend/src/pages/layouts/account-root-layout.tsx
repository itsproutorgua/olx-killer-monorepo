import { Outlet } from 'react-router-dom'

import { Header } from '@/widgets/header'
import BottomBar from '@/widgets/mobile-bottom-bar/bottom-bar.tsx'

export const AccountRootLayout = () => {
  return (
    <div className='grid min-h-screen grid-rows-[_auto_1fr]'>
      <Header />
      <main>
        <Outlet />
      </main>
      <div>
        <BottomBar />
      </div>
    </div>
  )
}
