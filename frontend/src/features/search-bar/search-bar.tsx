import { useTranslation } from 'react-i18next'

import { SearchIcon } from '@/shared/ui'
import { LangSwitcher } from '../lang-switcher/lang-switcher.tsx'

export const SearchBar = () => {
  const { t } = useTranslation()

  return (
    <div className='flex flex-1 items-center gap-5 xl:flex-none'>
      <div className='relative w-full xl:w-[616px]'>
        <input
          name='search'
          type='text'
          className='w-full rounded-[60px] py-2.5 pl-[48.92px] pr-[105px] placeholder:text-foreground focus:outline-none xl:pl-[58.49px] xl:pr-[133.89px]'
          placeholder={t('inputs.searchPlaceholder')}
        />
        <button className='absolute right-[2.81px] top-1/2 flex h-9 w-[91px] -translate-y-1/2 items-center justify-center rounded-[60px] bg-primary-900 text-[13px] text-gray-50 transition-colors duration-300 hover:bg-primary-500 active:bg-primary-600 active:duration-0 xl:right-[4.89px] xl:w-[117px]'>
          {t('buttons.searchButton')}
        </button>
        <SearchIcon className='absolute left-[13.07px] top-1/2 -translate-y-1/2 xl:left-[22.49px]' />
      </div>
      <div className='hidden xl:inline-block'>
        <LangSwitcher />
      </div>
    </div>
  )
}
