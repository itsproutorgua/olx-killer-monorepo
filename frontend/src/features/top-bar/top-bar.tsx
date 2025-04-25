import { useEffect, useRef, useState } from 'react'
import { Cross2Icon } from '@radix-ui/react-icons'
import { useTranslation } from 'react-i18next'

import { AsideNav } from '@/widgets/aside-nav'
import { NavToolbar } from '@/widgets/header/ui'
import { LangSwitcher } from '@/features/lang-switcher'
import { Logo, SearchIcon } from '@/shared/ui'
import { CatalogMenu } from '@/shared/ui/icons'
import { SearchIconRounded } from '@/shared/ui/icons/searchIconRounded.tsx'

export const TopBar = () => {
  const { t } = useTranslation()
  const [isExpanded, setIsExpanded] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)
  const sidebarRef = useRef<HTMLDivElement>(null)

  const handleToggleSearch = () => {
    setIsExpanded(prev => !prev)
  }

  const handleClickOutside = (e: MouseEvent) => {
    if (
      searchRef.current &&
      !searchRef.current.contains(e.target as Node) &&
      sidebarRef.current &&
      !sidebarRef.current.contains(e.target as Node)
    ) {
      setIsExpanded(false)
    }
  }

  useEffect(() => {
    if (isExpanded || isSidebarOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    } else {
      document.removeEventListener('mousedown', handleClickOutside)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isExpanded, isSidebarOpen])

  return (
    <div className='relative flex w-full items-center justify-between'>
      <CatalogMenu
        onClick={() => setIsSidebarOpen(true)}
        className='mr-5 h-10 w-10 shrink-0 cursor-pointer xl:hidden'
      />
      <Logo
        className={`flex items-center justify-center transition-opacity duration-700 ${
          !isExpanded ? 'opacity-100' : 'w-0 opacity-0'
        } xl:px-0 xl:opacity-100`}
      />

      {/* Search Section */}
      <div
        className={`ml-20 flex items-center gap-5 ${isExpanded && 'w-full'}`}
      >
        <div className='relative w-full xl:w-[616px]' ref={searchRef}>
          <div
            className={`flex items-center transition-all ${
              isExpanded
                ? 'w-full opacity-100 duration-200'
                : 'w-0 opacity-0 duration-0'
            } xl:w-full xl:px-0 xl:opacity-100`}
          >
            <input
              name='search'
              type='text'
              className='w-full rounded-[60px] py-2.5 pl-[48.92px] pr-[97px] placeholder:text-foreground focus:outline-none xl:pl-[58.49px] xl:pr-[133.89px]'
              placeholder={t('inputs.searchPlaceholder')}
            />
            <button className='absolute right-[4.81px] top-1/2 flex h-9 w-[91px] -translate-y-1/2 items-center justify-center rounded-[60px] bg-primary-900 text-[13px] text-gray-50 transition-colors duration-300 hover:bg-primary-500 active:bg-primary-600 active:duration-0 xl:right-[4.89px] xl:w-[117px]'>
              {t('buttons.searchButton')}
            </button>
            <SearchIcon className='absolute left-[17.49px] xl:left-[22.49px] xl:top-1/2 xl:-translate-y-1/2' />
          </div>
        </div>
        <button onClick={handleToggleSearch} className='z-10 ml-auto xl:hidden'>
          <SearchIconRounded />
        </button>

        <div className='hidden xl:inline-block'>
          <LangSwitcher />
        </div>
      </div>

      <NavToolbar />

      {/* Sidebar */}
      <div
        ref={sidebarRef}
        className={`fixed ${isSidebarOpen ? 'left-0' : '-left-full'} top-0 z-20 h-full w-[310px] overflow-y-scroll bg-gray-50 pb-32 transition-all duration-300 ease-out`}
      >
        <div className='flex justify-between py-4 pl-[27px] pr-5'>
          <h3 className='text-[26px] font-medium'>{t('words.categories')}</h3>
          <LangSwitcher />
          <button onClick={() => setIsSidebarOpen(false)}>
            <Cross2Icon className='h-6 w-6 transition-colors duration-300 hover:text-primary-500 active:text-primary-500' />
          </button>
        </div>
        <AsideNav onCloseMenu={() => setIsSidebarOpen(false)} />
      </div>

      {/* Backdrop */}
      <div
        className={`fixed ${isSidebarOpen ? 'left-0 opacity-40' : '-left-full opacity-0'} top-0 z-10 h-full w-full bg-black transition-opacity duration-700 ease-out`}
        onClick={() => setIsSidebarOpen(false)}
      />
    </div>
  )
}
