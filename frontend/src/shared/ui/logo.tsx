import { Link } from 'react-router-dom'

export const Logo = () => {
  return (
    <Link
      to='/'
      className='hidden text-[32px] font-semibold text-primary-foreground xl:inline-block'
    >
      OLX Killer
    </Link>
  )
}
