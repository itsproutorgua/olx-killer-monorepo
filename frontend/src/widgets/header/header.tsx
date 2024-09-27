import { SearchBar } from '@/features/search-bar'
import { Logo } from '@/shared/ui'
import { NavToolbar } from './ui'

export const Header = () => {
  return (
    <header className='mx-auto w-full rounded-b-[30px] bg-primary xl:mt-5 xl:w-[1360px] xl:rounded-[50px]'>
      <div className='flex items-center justify-between px-[11px] py-[17px] xl:px-[38px]'>
        <Logo />
        <SearchBar />
        <NavToolbar />
      </div>
    </header>
  )
}
