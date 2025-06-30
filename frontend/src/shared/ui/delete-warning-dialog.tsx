import { LoaderCircle } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/shadcn-ui/dialog'
import { DeleteSmall } from '@/shared/ui/icons/delete-small.tsx'

interface DeleteWarningProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onClickDelete: (roomId?: string) => void
  isDeleting: boolean
  title?: string
  message?: string
}

export function DeleteWarningDialog({
  open,
  onOpenChange,
  onClickDelete,
  isDeleting,
  title,
  message,
}: DeleteWarningProps) {
  const { t } = useTranslation()

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        aria-describedby={undefined}
        className='w-full max-w-[451px] gap-[30px] rounded-[20px] border-none bg-gray-50 p-[50px] text-gray-900'
      >
        <DialogHeader className='space-y-4'>
          <DialogTitle className='flex flex-col items-center gap-5 text-2xl font-medium leading-[29px] text-gray-900'>
            <DeleteSmall className='h-[34px] w-[34px] text-error-700' />
            <span>{title ? t(title) : t('title.deleteDefaultWarning')}</span>
          </DialogTitle>
          <DialogDescription className='text-[16px] font-normal leading-5'>
            {message ? t(message) : t('words.deleteDefaultWarning')}
          </DialogDescription>
        </DialogHeader>
        <div className='flex flex-col gap-[10px]'>
          <button
            onClick={() => onClickDelete()}
            disabled={isDeleting}
            className='flex w-full justify-center rounded-[60px] bg-error-700 px-5 py-[13px] leading-4 text-gray-50 transition duration-300 hover:bg-error-800 disabled:cursor-not-allowed disabled:bg-gray-400 disabled:text-gray-50'
          >
            {isDeleting ? (
              <LoaderCircle className='size-4 animate-spin self-center' />
            ) : (
              t('buttons.delete')
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
