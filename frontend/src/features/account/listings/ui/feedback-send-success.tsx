import { useTranslation } from 'react-i18next'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/shadcn-ui/dialog'
import { SuccessIcon } from '@/shared/ui/icons'

interface FeedbackSendSuccessProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function FeedbackSendSuccess({
  open,
  onOpenChange,
}: FeedbackSendSuccessProps) {
  const { t } = useTranslation()

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        aria-describedby={undefined}
        onInteractOutside={e => e.preventDefault()}
        className='w-full max-w-[451px] gap-[30px] rounded-[20px] border-none bg-gray-50 p-[50px] text-gray-900'
      >
        <DialogHeader className='space-y-4'>
          <DialogTitle className='flex flex-col items-center gap-5 text-2xl font-medium leading-[29px] text-gray-900'>
            <SuccessIcon className='h-[34px] w-[34px]' />
            <span>{t('title.feedbackSuccess')}</span>
          </DialogTitle>
          <DialogDescription className='text-[16px] font-normal leading-5'>
            {t('listings.feedbackSuccess')}
          </DialogDescription>
        </DialogHeader>
        <button
          onClick={() => onOpenChange(false)}
          className='w-full rounded-[60px] bg-primary-900 px-5 py-[13px] leading-4 text-gray-50'
        >
          {t('buttons.backToAccount')}
        </button>
      </DialogContent>
    </Dialog>
  )
}
