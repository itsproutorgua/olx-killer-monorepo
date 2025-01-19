import { AccountPageMobile } from '@/pages/account/account-page-mobile.tsx'
import { ListingsPage } from '@/pages/listings/listings-page.tsx'
import { useMediaQuery } from '@/shared/library/hooks'

export const AccountPage = () => {
  const isMobile = useMediaQuery('(max-width: 767px)')
  return <>{isMobile ? <AccountPageMobile /> : <ListingsPage />}</>
}
