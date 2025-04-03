import React from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import { Button } from '@/shared/ui/shadcn-ui/button.tsx'
import { DangerTriangleIcon } from '@/shared/ui/icons'
import { PRIVATE_PAGES } from '@/shared/constants'
import { cn } from '@/shared/library/utils'

interface Props {
  className?: string
}

export const ProfileNotFilled: React.FC<Props> = ({ className }) => {
  const { t } = useTranslation()
  return (
    <div className={cn('bg-warning-100 rounded-[10px] p-6', className)}>
      <h3 className='flex items-center gap-4 text-sm font-medium'>
        <DangerTriangleIcon />
        <span className='text-black'>{t('profileForm.titles.notFilled')}</span>
      </h3>
      <p className='mt-[10px] text-xs text-gray-800 xl:text-sm'>
        {t('profileForm.messages.fillProfile')}
      </p>
      <Link to={`${PRIVATE_PAGES.PROFILE}`}>
        <Button className='mt-5 h-[42px] rounded-[60px] bg-primary-900 px-[45px] py-[13px] leading-4 text-gray-50'>
          {t('buttons.toProfile')}
        </Button>
      </Link>
    </div>
  )
}
