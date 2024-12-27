import { FavoritesIconOutline } from '@/shared/ui/icons/favorites-icon-outline.tsx'
import { FavoritesIcon } from '@/shared/ui/icons/favorites-icon.tsx'
import { MessagesIconOutline } from '@/shared/ui/icons/messages-icon-outline.tsx'
import { MessagesIcon } from '@/shared/ui/icons/messages-icon.tsx'
import { PenIconRoundedOutline } from '@/shared/ui/icons/pen-icon-rounded-outline.tsx'
import { PenIconRounded } from '@/shared/ui/icons/pen-icon-rounded.tsx'
import { ProfileIconOutline } from '@/shared/ui/icons/profile-icon-outline.tsx'
import { ProfileIcon } from '@/shared/ui/icons/profile-icon.tsx'
import { SettingsIconOutline } from '@/shared/ui/icons/settings-icon-outline.tsx'
import { SettingsIcon } from '@/shared/ui/icons/settings-icon.tsx'

export const SIDEBAR_ITEMS = [
  {
    title: 'account.listings',
    url: '/account/listings',
    icon: {
      solid: PenIconRounded,
      outline: PenIconRoundedOutline,
    },
  },
  {
    title: 'account.messages',
    url: '/account/chat',
    icon: {
      solid: MessagesIcon,
      outline: MessagesIconOutline,
    },
  },
  {
    title: 'account.favorites',
    url: '/account/favorites',
    icon: {
      solid: FavoritesIcon,
      outline: FavoritesIconOutline,
    },
  },
  {
    title: 'account.profile',
    url: '/account/profile',
    icon: {
      solid: ProfileIcon,
      outline: ProfileIconOutline,
    },
  },
  {
    title: 'account.settings',
    url: '/account/settings',
    icon: {
      solid: SettingsIcon,
      outline: SettingsIconOutline,
    },
  },
]
