import { Outlet } from 'react-router-dom'

import { Footer } from '@/widgets/footer'
import { Header } from '@/widgets/header'
import BottomBar from '@/widgets/mobile-bottom-bar/bottom-bar.tsx'
import { useMediaQuery } from '@/shared/library/hooks'

export const AccountRootLayout = () => {
  const isMobile = useMediaQuery('(max-width: 767px)')
  return (
    <div className='grid grid-rows-[_auto_1fr] xl:min-h-screen'>
      <Header />
      <main>
        <Outlet />
      </main>
      <div>
        {!isMobile && <Footer />}
        <BottomBar />
      </div>
    </div>
  )
}
