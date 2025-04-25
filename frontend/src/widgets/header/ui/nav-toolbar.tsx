import { FavoriteButton } from '@/widgets/favorite-button'
import { MessageButton } from '@/widgets/message-button'
import { UserMenu } from '@/entities/user'

export const NavToolbar = () => {
  return (
    <ul className='hidden xl:flex xl:items-center'>
      <FavoriteButton />
      <MessageButton />
      <UserMenu />
    </ul>
  )
}
