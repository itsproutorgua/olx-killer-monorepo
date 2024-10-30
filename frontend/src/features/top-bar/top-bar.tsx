import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { NavToolbar } from '@/widgets/header/ui'
import { LangSwitcher } from '@/features/lang-switcher'
import { Logo, SearchIcon } from '@/shared/ui'
import { BottomBarMenu } from '@/shared/ui/icons'
import { SearchIconRounded } from '@/shared/ui/icons/searchIconRounded.tsx'

export const TopBar = () => {
  const { t } = useTranslation()
  const [isExpanded, setIsExpanded] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)
  const handleToggleSearch = () => {
    setIsExpanded(prev => !prev)
  }

  const handleClickOutside = (e: MouseEvent) => {
    if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
      setIsExpanded(false)
    }
  }

  useEffect(() => {
    if (isExpanded) {
      document.addEventListener('mousedown', handleClickOutside)
    } else {
      document.removeEventListener('mousedown', handleClickOutside)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isExpanded])

  return (
    <div className='flex w-full items-center justify-between'>
      <BottomBarMenu className='mr-5 h-10 w-10 shrink-0 md:hidden' />
      <Logo
        className={`flex items-center justify-center transition-all duration-300 ${
          !isExpanded ? 'opacity-100' : 'w-0 opacity-0'
        } md:px-0 md:opacity-100`}
      />
      <div className={`flex items-center gap-5 ${isExpanded && 'w-full'}`}>
        <div className='relative w-full xl:w-[616px]'>
          <div
            className={`flex items-center transition-all ${
              isExpanded
                ? 'w-full opacity-100 duration-200'
                : 'w-0 opacity-0 duration-0'
            } md:w-full md:px-0 md:opacity-100`}
          >
            <input
              name='search'
              type='text'
              className='w-full rounded-[60px] py-2.5 pl-[48.92px] pr-[97px] placeholder:text-foreground focus:outline-none md:pl-[58.49px] md:pr-[133.89px]'
              placeholder={t('inputs.searchPlaceholder')}
            />
            <button className='absolute right-[4.81px] top-1/2 flex h-9 w-[91px] -translate-y-1/2 items-center justify-center rounded-[60px] bg-primary-900 text-[13px] text-gray-50 transition-colors duration-300 hover:bg-primary-500 active:bg-primary-600 active:duration-0 xl:right-[4.89px] xl:w-[117px]'>
              {t('buttons.searchButton')}
            </button>
            <SearchIcon className='absolute left-[17.49px] md:top-1/2 md:-translate-y-1/2 xl:left-[22.49px]' />
          </div>
        </div>
        <button
          onClick={handleToggleSearch}
          className='z-10 ml-auto md:hidden' // Added z-10 for higher z-index
        >
          <SearchIconRounded />
        </button>

        <div className='hidden xl:inline-block'>
          <LangSwitcher />
        </div>
      </div>
      <NavToolbar />
    </div>
  )
}
