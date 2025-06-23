import { useAuth0 } from '@auth0/auth0-react'
import { LoaderCircle } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/shadcn-ui/dialog'
import { ProfileIconOutline } from '@/shared/ui/icons/profile-icon-outline.tsx'

interface LoginToWriteProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  isLoading: boolean
}

export function LoginToWrite({
  open,
  onOpenChange,
  isLoading,
}: LoginToWriteProps) {
  const { t } = useTranslation()
  const { loginWithRedirect } = useAuth0()

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        aria-describedby={undefined}
        onInteractOutside={e => e.preventDefault()}
        className='w-full max-w-[355px] gap-5 rounded-[20px] border-none bg-gray-50 p-[30px] pb-[17px] text-gray-900 xl:max-w-[451px] xl:gap-[30px] xl:p-[50px] xl:pb-[37px]'
      >
        <DialogHeader className='space-y-4'>
          <DialogTitle className='flex flex-col items-center gap-5 text-xl font-medium leading-[29px] text-gray-900 xl:text-2xl'>
            <div className='flex h-[52px] w-[52px] items-center justify-center rounded-full bg-primary-100'>
              <ProfileIconOutline className='h-7 w-7 text-primary-800' />
            </div>
            <span>{t('title.loginToContinue')}</span>
          </DialogTitle>
          <DialogDescription className='text-[14px] font-normal leading-5 xl:text-[16px]'>
            {t('messages.loginToWrite')}
          </DialogDescription>
        </DialogHeader>
        <div className='flex flex-col gap-[10px]'>
          <button
            onClick={() =>
              loginWithRedirect({
                appState: { targetUrl: window.location.pathname },
              })
            }
            disabled={isLoading}
            className='flex w-full justify-center rounded-[60px] bg-primary-800 px-5 py-[13px] leading-4 text-gray-50 transition duration-300 hover:bg-primary-900 disabled:cursor-not-allowed disabled:bg-gray-400 disabled:text-gray-50'
          >
            {isLoading ? (
              <LoaderCircle className='size-4 animate-spin self-center' />
            ) : (
              t('buttons.loginOrCreate')
            )}
          </button>
          <button
            onClick={() => onOpenChange(false)}
            className='w-full px-5 py-[13px] leading-4'
          >
            {t('buttons.returnBack')}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
