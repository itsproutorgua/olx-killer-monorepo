import { CartButton } from '@/widgets/cart-button'
import { FavoriteButton } from '@/widgets/favorite-button'
import { UserMenu } from '@/entities/user'

export const NavToolbar = () => {
  return (
    <ul className='hidden xl:flex xl:items-center xl:gap-5'>
      <UserMenu />
      <FavoriteButton />
      <CartButton />
    </ul>
  )
}
