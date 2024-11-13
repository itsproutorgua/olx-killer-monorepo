import { useEffect, useState } from 'react'
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
    getIdTokenClaims,
  } = useAuth0()
  const [isOpen, setIsOpen] = useState(false)
  const [registrationStatus, setRegistrationStatus] = useState<string | null>(
    null,
  )

  useEffect(() => {
    const registerUser = async () => {
      try {
        const token = await getIdTokenClaims()

        if (token) {
          const response = await fetch(
            'https://api.house-community.site/uk/api/v1/users/authentication/',
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                id_token: token.__raw,
              }),
            },
          )

          if (response.ok) {
            setRegistrationStatus('Registration successful')
          } else {
            setRegistrationStatus('Registration failed')
          }
        }
      } catch (error) {
        console.error('Error fetching access token or registering user:', error)
        setRegistrationStatus('Registration error')
      }
    }

    if (isAuthenticated && !registrationStatus) {
      registerUser()
    }
  }, [getIdTokenClaims, isAuthenticated, registrationStatus])

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

            {registrationStatus && (
              <DropdownMenuItem>
                <div className='text-center'>
                  <span>{registrationStatus}</span>
                </div>
              </DropdownMenuItem>
            )}
          </>
        ) : (
          <DropdownMenuItem
            onClick={() => loginWithRedirect()}
            className='cursor-pointer'
          >
            Please Log In{' '}
            <span className='ml-2'>
              <LogInIcon />
            </span>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
