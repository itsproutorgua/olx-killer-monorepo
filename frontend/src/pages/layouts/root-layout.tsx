import { Outlet } from 'react-router-dom'

import { Footer } from '@/widgets/footer'
import { Header } from '@/widgets/header'
import BottomBar from '@/widgets/mobile-bottom-bar/bottom-bar.tsx'

export const RootLayout = () => {
  return (
    <div className='grid min-h-screen grid-rows-[_auto_1fr_auto]'>
      <Header />
      <main>
        <Outlet />
      </main>
      <div>
        <Footer />
        <BottomBar />
      </div>
    </div>
  )
}
