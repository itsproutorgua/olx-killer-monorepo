import React from 'react'
import { useAuth0 } from '@auth0/auth0-react'

import { Button } from '@/shared/ui/shadcn-ui/button.tsx'

interface Props {
  className?: string
}

export const LoginCard: React.FC<Props> = ({ className }) => {
  const { loginWithRedirect } = useAuth0()

  return (
    <div className={className}>
      <div className='flex h-full flex-col rounded-[15px] border border-border px-6 py-[34px]'>
        <div className='flex flex-col justify-between gap-[22px] md:flex-row md:items-center md:gap-[45px]'>
          <div className='flex flex-row items-center gap-[17px]'>
            <div className='flex flex-col gap-3'>
              <h3 className='font-semibold leading-none'>YOUR ACCOUNT</h3>
              <p className='leading-5'>
                Log in to your profile or create a new one to contact this
                seller.
              </p>
            </div>
          </div>
          <div className='flex flex-row gap-[14px]'>
            <Button
              className='h-[42px] px-[45px] py-[13px] transition-colors duration-300'
              onClick={() => loginWithRedirect()}
            >
              Log in
            </Button>
            <button
              className='whitespace-nowrap text-xs transition-colors duration-300 hover:text-accent'
              onClick={() => loginWithRedirect()}
            >
              Create an account
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
