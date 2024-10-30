import { TopBar } from '@/features/top-bar'

export const Header = () => {
  return (
    <header className='overflow-x-hidden rounded-b-[30px] bg-primary-900 xl:mt-5 xl:rounded-none xl:bg-transparent'>
      <div className='px-[11px] md:container'>
        <div className='flex h-20 items-center xl:h-[76px] xl:rounded-[50px] xl:bg-primary-900 xl:px-[38px]'>
          <TopBar />
        </div>
      </div>
    </header>
  )
}
