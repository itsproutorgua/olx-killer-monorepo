import { useAuth0 } from '@auth0/auth0-react'
import { Outlet } from 'react-router-dom'

import { PageLoader } from '@/shared/ui'

const PrivateRoute = () => {
  const { isAuthenticated, isLoading, loginWithRedirect } = useAuth0()

  if (isLoading) {
    return <PageLoader />
  }
  if (isAuthenticated) {
    return <Outlet />
  }

  loginWithRedirect().catch(error => console.error(error))
  return <PageLoader />
}

export default PrivateRoute
