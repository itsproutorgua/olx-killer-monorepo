import { profileDefault } from '@/shared/assets'
import { useAuth0 } from '@auth0/auth0-react'
import { Spinner } from '@chakra-ui/spinner'
import { ErrorIcon } from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import { useUserProfile } from '@/entities/user/hooks/useUserProfile.tsx'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/ui/shadcn-ui/dropdown-menu.tsx'
import { ArrowLeftRed } from '@/shared/ui/icons/arrow-left-red.tsx'
import { DangerIcon } from '@/shared/ui/icons/danger-icon.tsx'
import { PRIVATE_PAGES } from '@/shared/constants'
import { UserButton } from './ui'

export const UserMenu = () => {
  const { t } = useTranslation()
  const { isAuthenticated, user, loginWithRedirect, logout, isLoading, error } =
    useAuth0()
  const { data: profile } = useUserProfile()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        asChild
        className='flex size-11 items-center justify-center text-gray-50'
      >
        <div>
          {error && <ErrorIcon />}
          {(!error && isLoading) ||
            (!profile && isAuthenticated && (
              <Spinner
                thickness='4px'
                speed='0.65s'
                emptyColor='hsl(0 0% 98%)'
                color='hsl(237 70% 61%)'
                size='xl'
                className='h-8 w-8'
              />
            ))}
          {!error && !isLoading && !isAuthenticated && <UserButton />}
          {!error && !isLoading && isAuthenticated && profile && (
            <img
              src={profile?.picture || profileDefault}
              alt='Profile'
              className='h-8 w-8 cursor-pointer rounded-full object-cover'
            />
          )}
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='mr-[67px] w-[190px] bg-background p-0'>
        {isAuthenticated ? (
          <>
            <Link to={`${PRIVATE_PAGES.LISTINGS}`}>
              <DropdownMenuItem className='cursor-pointer justify-between py-[11px] pl-[16px] pr-3'>
                <span>{t('account.myAccount')}</span>
                {!user?.email_verified && <DangerIcon />}
              </DropdownMenuItem>
            </Link>
            <Link to={PRIVATE_PAGES.CHAT}>
              <DropdownMenuItem className='cursor-pointer border-y py-[14px] pl-[16px] leading-none'>
                <span>{t('account.messages')}</span>
              </DropdownMenuItem>
            </Link>
            <DropdownMenuItem
              onClick={() => logout()}
              className='cursor-pointer gap-3 py-[14px] pl-[16px] leading-none text-error-700'
            >
              <ArrowLeftRed />
              {t('account.logOut')}
            </DropdownMenuItem>
          </>
        ) : (
          <DropdownMenuItem
            onClick={() =>
              loginWithRedirect({
                appState: { targetUrl: window.location.pathname },
              })
            }
            className='h-[42px] cursor-pointer'
          >
            {t('account.logIn')}
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
