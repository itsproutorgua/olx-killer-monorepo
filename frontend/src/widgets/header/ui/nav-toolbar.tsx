import { FavoriteButton } from '@/widgets/favorite-button'
import { UserMenu } from '@/entities/user'

export const NavToolbar = () => {
  return (
    <ul className='hidden xl:flex xl:items-center'>
      <FavoriteButton />
      <UserMenu />
    </ul>
  )
}
