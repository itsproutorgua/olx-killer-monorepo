import { useAuth0 } from '@auth0/auth0-react'
import { Outlet } from 'react-router-dom'

import { PageLoader } from '@/shared/ui'

const PrivateRoute = () => {
  const { isAuthenticated, loginWithRedirect } = useAuth0()
  if (isAuthenticated) {
    return <Outlet />
  } else {
    loginWithRedirect().catch(error => console.error(error))
    return <PageLoader />
  }
}

export default PrivateRoute
