import React from 'react'
import { useTranslation } from 'react-i18next'

import { DangerTriangleIcon } from '@/shared/ui/icons'
import { cn } from '@/shared/library/utils'

interface Props {
  className?: string
}

export const EmailNotVerified: React.FC<Props> = ({ className }) => {
  const { t } = useTranslation()
  return (
    <div className={cn('rounded-[10px] bg-error-200 p-6', className)}>
      <h3 className='flex items-center gap-4 text-sm font-medium'>
        <DangerTriangleIcon />
        <span className='text-black'>
          {t('profileForm.titles.emailNotVerified')}
        </span>
      </h3>
      <p className='mt-[10px] text-xs text-gray-800 xl:text-sm'>
        {t('profileForm.messages.verifyEmail')}
      </p>
    </div>
  )
}
