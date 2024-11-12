import { useState } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import { Spinner } from '@chakra-ui/spinner'
import { LogInIcon, LogOutIcon } from 'lucide-react'
import { ErrorIcon } from 'react-hot-toast'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/ui/shadcn-ui/dropdown-menu.tsx'
import { UserButton } from './ui'

export const UserMenu = () => {
  const {
    isAuthenticated,
    user,
    loginWithRedirect,
    logout,
    isLoading,
    error,
    getAccessTokenSilently,
  } = useAuth0()
  const [isOpen, setIsOpen] = useState(false)
  const [registrationStatus, setRegistrationStatus] = useState<string | null>(
    null,
  )

  const domain = 'dev-oiwvoe5rjc073q1x.eu.auth0.com'

  const handleRegisterUser = async () => {
    try {
      const accessToken = await getAccessTokenSilently({
        authorizationParams: {
          audience: `https://${domain}/api/v2/`,
          scope: 'read:current_user',
        },
      })
      console.log(accessToken)
      const response = await fetch(
        'https://api.house-community.site/uk/api/v1/registration/',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            auth_token: accessToken,
          }),
        },
      )

      if (response.ok) {
        const data = await response.json()
        console.log('Registration successful:', data)
        setRegistrationStatus('Registration successful')
      } else {
        const errorData = await response.json()
        console.error('Registration failed:', errorData)
        setRegistrationStatus('Registration failed')
      }
    } catch (err) {
      console.error('Error fetching access token or registering user:', err)
      setRegistrationStatus('Registration error')
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        asChild
        className='flex size-11 items-center justify-center text-gray-50'
      >
        <div onClick={() => setIsOpen(!isOpen)}>
          {error && <ErrorIcon />}
          {!error && isLoading && (
            <Spinner
              thickness='4px'
              speed='0.65s'
              emptyColor='hsl(0 0% 98%)'
              color='hsl(237 70% 61%)'
              size='xl'
              className='h-8 w-8'
            />
          )}
          {!error && !isLoading && !isAuthenticated && <UserButton />}
          {!error && !isLoading && isAuthenticated && (
            <img
              src={user?.picture}
              alt='Profile'
              className='h-8 w-8 cursor-pointer rounded-full'
            />
          )}
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='bg-background p-2'>
        {isAuthenticated ? (
          <>
            <DropdownMenuItem>
              <span>{user?.name}</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <span>{user?.email}</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <span>
                E-mail: {user?.email_verified ? 'Verified' : 'Not Verified'}
              </span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => logout()}
              className='cursor-pointer'
            >
              <LogOutIcon className='mr-2 h-4 w-4' />
              Log Out
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={handleRegisterUser}
              className='cursor-pointer'
            >
              Register User
            </DropdownMenuItem>
          </>
        ) : (
          <DropdownMenuItem
            onClick={() =>
              loginWithRedirect({
                authorizationParams: {
                  audience: `https://${domain}/api/v2/`,
                  scope: 'read:current_user',
                },
              })
            }
            className='cursor-pointer'
          >
            Please Log In{' '}
            <span className='ml-2'>
              <LogInIcon />
            </span>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
      {registrationStatus && (
        <div className='mt-2 text-center text-gray-50'>
          <span>{registrationStatus}</span>
        </div>
      )}
    </DropdownMenu>
  )
}
