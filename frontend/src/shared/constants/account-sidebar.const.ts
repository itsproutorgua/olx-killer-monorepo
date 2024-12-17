import { FavoritesIcon } from '@/shared/ui/icons/favorites-icon.tsx'
import { MessagesIcon } from '@/shared/ui/icons/messages-icon.tsx'
import { PenIconRounded } from '@/shared/ui/icons/pen-icon-rounded.tsx'
import { ProfileIcon } from '@/shared/ui/icons/profile-icon.tsx'
import { SettingsIcon } from '@/shared/ui/icons/settings-icon.tsx'

export const SIDEBAR_ITEMS = [
  {
    title: 'account.listings',
    url: '/account/listings',
    icon: PenIconRounded,
  },
  {
    title: 'account.messages',
    url: '/account/chat',
    icon: MessagesIcon,
  },
  {
    title: 'account.favorites',
    url: '/account/favorites',
    icon: FavoritesIcon,
  },
  {
    title: 'account.profile',
    url: '/account/profile',
    icon: ProfileIcon,
  },
  {
    title: 'account.settings',
    url: '/account/settings',
    icon: SettingsIcon,
  },
]
