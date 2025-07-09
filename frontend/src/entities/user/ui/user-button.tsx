import { UserRoundedIcon } from '@/shared/ui/icons'

export const UserButton = () => {
  return (
    <button className='group -ml-3 mt-[2px] flex size-11 items-center justify-center text-gray-50 transition-colors duration-300'>
      <UserRoundedIcon className='h-6 w-6 fill-primary-900 transition-colors duration-300 group-hover:fill-primary-50' />
    </button>
  )
}
