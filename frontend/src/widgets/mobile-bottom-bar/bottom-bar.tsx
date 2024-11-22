import { useEffect, useState } from 'react'
import clsx from 'clsx'
import { Heart } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import { CirclePlusIcon, UserRoundedIcon } from '@/shared/ui/icons'
import { BottomBarHome } from '@/shared/ui/icons/bottom-bar-home.tsx'
import { ChatIcon } from '@/shared/ui/icons/chat-icon.tsx'

const SCROLL_THRESHOLD = 5 // Threshold to ignore small scroll movements

const BottomBar = () => {
  const { t } = useTranslation()

  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)

  const handleScroll = () => {
    const currentScrollY = window.scrollY
    const windowHeight = window.innerHeight
    const documentHeight = document.body.scrollHeight

    // If the user is near the top, ensure the bottom bar is visible
    if (currentScrollY <= SCROLL_THRESHOLD) {
      setIsVisible(true)
      setLastScrollY(currentScrollY)
      return
    }

    // If the user is at the bottom of the page, hide the bottom bar
    if (windowHeight + currentScrollY >= documentHeight - SCROLL_THRESHOLD) {
      setIsVisible(false)
    } else {
      // Handle scroll direction, but ignore small scroll fluctuations
      if (Math.abs(currentScrollY - lastScrollY) < SCROLL_THRESHOLD) {
        return
      }

      if (currentScrollY > lastScrollY) {
        // Scrolling down
        setIsVisible(false)
      } else {
        // Scrolling up
        setIsVisible(true)
      }
    }

    setLastScrollY(currentScrollY)
  }

  useEffect(() => {
    window.addEventListener('scroll', handleScroll)

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [lastScrollY])

  return (
    <div
      className={clsx(
        'fixed bottom-0 left-0 right-0 z-50 transform transition-transform duration-300 md:hidden',
        isVisible ? 'translate-y-0' : 'translate-y-[100px]',
      )}
    >
      {/* Bottom Menu Bar */}
      <div className='relative flex h-[75px] items-center justify-between rounded-t-[30px] bg-[#2c2a84] px-[8px] text-gray-50'>
        <div className='flex w-[35%] flex-row justify-between gap-2'>
          <Link to='/' className='flex w-[70px] flex-col items-center'>
            <BottomBarHome />
            <span className='text-[13px]'>{t('bottomBar.home')}</span>
          </Link>

          <Link to='/favorites' className='flex w-[70px] flex-col items-center'>
            <Heart className='h-[30px] w-6 stroke-[1.5]' />
            <span className='text-[13px]'>{t('bottomBar.favorites')}</span>
          </Link>
        </div>

        {/* Center Floating Action Button */}
        <div className='absolute left-1/2 top-[-24px] -translate-x-1/2 transform rounded-full bg-gray-50 p-[5px] shadow-custom-purple'>
          <button className='flex h-12 w-12 items-center justify-center rounded-full bg-white text-[#2c2a84]'>
            <CirclePlusIcon />
          </button>
        </div>

        <div className='flex w-[35%] flex-row justify-between gap-2'>
          <Link to='/chat' className='flex w-[70px] flex-col items-center'>
            <ChatIcon className='h-[30px h-[30px] stroke-1' />
            <span className='text-[13px]'>{t('bottomBar.chat')}</span>
          </Link>

          <Link to='/account' className='flex w-[70px] flex-col items-center'>
            <UserRoundedIcon className='h-[30px] w-6 fill-primary-900' />
            <span className='text-[13px]'>{t('bottomBar.account')}</span>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default BottomBar
