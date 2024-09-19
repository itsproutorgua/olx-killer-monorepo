import { Link } from 'react-router-dom'

export const Logo = () => {
  return (
    <Link
      to='/public'
      className='text-primary-foreground hidden text-[32px] font-semibold xl:inline-block'
    >
      OLX Killer
    </Link>
  )
}
