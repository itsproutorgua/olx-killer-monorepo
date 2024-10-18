import { useEffect, useState } from 'react'
import clsx from 'clsx'
import { Heart } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import {
  BottomBarMenu,
  CartIcon,
  CirclePlusIcon,
  UserRoundedIcon,
} from '@/shared/ui/icons'

const BottomBar = () => {
  const { t } = useTranslation()

  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)

  const handleScroll = () => {
    const currentScrollY = window.scrollY

    if (currentScrollY > lastScrollY) {
      setIsVisible(false)
    } else {
      setIsVisible(true)
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
      <div className='relative flex h-[75px] items-center justify-between rounded-t-[30px] bg-[#2c2a84] px-[5px] text-gray-50'>
        <div className='flex w-[35%] flex-row justify-between gap-2'>
          <Link to='/catalog' className='flex w-[70px] flex-col items-center'>
            <BottomBarMenu />
            <span className='text-[13px]'>{t('bottomBar.catalog')}</span>
          </Link>

          <Link to='/favorites' className='flex w-[70px] flex-col items-center'>
            <Heart className='h-[30px] w-6 stroke-[1.5]' />
            <span className='text-[13px]'>{t('bottomBar.favorites')}</span>
          </Link>
        </div>

        {/* Center Floating Action Button */}
        <div className='absolute left-1/2 top-[-24px] -translate-x-1/2 transform rounded-full bg-gray-50 p-[5px] shadow-custom-purple'>
          <button className='bg-white flex h-12 w-12 items-center justify-center rounded-full text-[#2c2a84]'>
            <CirclePlusIcon />
          </button>
        </div>

        <div className='flex w-[35%] flex-row justify-between gap-2'>
          <Link to='/cart' className='flex w-[70px] flex-col items-center'>
            <CartIcon className='h-[30px] w-6' />
            <span className='text-[13px]'>{t('bottomBar.cart')}</span>
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
