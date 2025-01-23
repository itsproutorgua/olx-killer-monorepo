import { AccountPageMobile } from '@/pages/account/account-page-mobile.tsx'
import { UserListingsPage } from '@/pages/account/user-listings/user-listings-page.tsx'
import { useMediaQuery } from '@/shared/library/hooks'

export const AccountPage = () => {
  const isMobile = useMediaQuery('(max-width: 767px)')
  return <>{isMobile ? <AccountPageMobile /> : <UserListingsPage />}</>
}
