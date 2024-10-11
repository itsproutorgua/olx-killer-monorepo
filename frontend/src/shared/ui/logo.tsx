import { Link } from 'react-router-dom'

export const Logo = () => {
  return (
    <Link
      to='/'
      className='hidden text-[32px] font-semibold text-gray-50 xl:inline-block'
    >
      OLX Killer
    </Link>
  )
}
