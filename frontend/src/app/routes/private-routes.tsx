import { useAuth0 } from '@auth0/auth0-react'
import { Outlet } from 'react-router-dom'

import { WelcomePage } from '@/pages/account/welcome/welcome-page.tsx'
import { PageLoader } from '@/shared/ui'

const PrivateRoute = () => {
  const { isAuthenticated, isLoading } = useAuth0()

  if (isLoading) {
    return <PageLoader />
  }
  if (isAuthenticated) {
    return <Outlet />
  } else {
    return <WelcomePage />
  }
}

export default PrivateRoute
