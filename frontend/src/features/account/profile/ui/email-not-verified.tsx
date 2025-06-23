import React from 'react'
import { useTranslation } from 'react-i18next'

import { DangerTriangleIcon } from '@/shared/ui/icons'
import { cn } from '@/shared/library/utils'

interface Props {
  className?: string
  refreshEmailVerified: () => void
  isLoading?: boolean
}

export const EmailNotVerified: React.FC<Props> = ({
  className,
  refreshEmailVerified,
  isLoading,
}) => {
  const { t } = useTranslation()
  return (
    <div className={cn('rounded-[10px] bg-error-200 p-6', className)}>
      <h3 className='flex items-center gap-4 text-sm font-medium'>
        <DangerTriangleIcon className='text-error-700' />
        <span className='text-black'>
          {t('profileForm.titles.emailNotVerified')}
        </span>
      </h3>
      <p className='mt-[10px] text-xs text-gray-800 xl:text-sm'>
        {t('profileForm.messages.verifyEmail')}
      </p>
      <button
        type='button'
        onClick={refreshEmailVerified}
        className='mt-2 rounded-[30px] bg-gray-500 px-3 py-2 text-xs text-gray-100'
      >
        {isLoading && '...'}
        {t('buttons.recheckAgain')}
      </button>
    </div>
  )
}
