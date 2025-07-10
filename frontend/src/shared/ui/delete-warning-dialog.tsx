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
        className='w-full max-w-[451px] gap-[30px] rounded-[20px] border-none bg-gray-50 p-[30px] pb-[17px] text-gray-900 xl:p-[50px] xl:pb-[37px]'
      >
        <DialogHeader className='mx-auto max-w-[295px] space-y-4 xl:max-w-[352px]'>
          <DialogTitle className='flex max-w-[295] flex-col items-center gap-5 text-[20px] font-medium leading-[29px] text-gray-900 xl:max-w-[352px] xl:text-2xl'>
            <DeleteSmall className='h-[34px] w-[34px] text-error-700' />
            <span>{title ? t(title) : t('title.deleteDefaultWarning')}</span>
          </DialogTitle>
          <DialogDescription className='text-sm font-normal xl:text-[16px] xl:leading-5'>
            {message ? t(message) : t('words.deleteDefaultWarning')}
          </DialogDescription>
        </DialogHeader>
        <div className='flex flex-col gap-[10px]'>
          <button
            onClick={() => onClickDelete()}
            disabled={isDeleting}
            className='flex w-full justify-center rounded-[60px] bg-error-700 px-5 py-[13px] text-sm text-gray-50 transition duration-300 hover:bg-error-800 disabled:cursor-not-allowed disabled:bg-gray-400 disabled:text-gray-50 xl:text-[16px] xl:leading-4'
          >
            {isDeleting ? (
              <LoaderCircle className='size-4 animate-spin self-center' />
            ) : (
              t('buttons.delete')
            )}
          </button>
          <button
            onClick={() => onOpenChange(false)}
            className='w-full px-5 py-[13px] text-sm xl:text-[16px]'
          >
            {t('buttons.returnBack')}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
