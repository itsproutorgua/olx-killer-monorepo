import { SearchBar } from '@/features/search-bar'
import { Logo } from '@/shared/ui'
import { NavToolbar } from './ui'

export const Header = () => {
  return (
    <header className='rounded-b-[30px] bg-primary-900 xl:mt-5 xl:rounded-none xl:bg-transparent'>
      <div className='container'>
        <div className='flex h-20 items-center justify-between xl:h-[76px] xl:rounded-[50px] xl:bg-primary-900 xl:px-[38px]'>
          <Logo />
          <SearchBar />
          <NavToolbar />
        </div>
      </div>
    </header>
  )
}
