import { UserRoundedIcon } from '@/shared/ui/icons'

export const UserButton = () => {
  return (
    <button className='group flex size-11 items-center justify-center text-gray-50 transition-colors duration-300'>
      <UserRoundedIcon className='h-6 w-6 transition-colors duration-300 group-hover:fill-primary-50' />
    </button>
  )
}
