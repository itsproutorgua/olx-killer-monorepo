import React from 'react'
import { useTranslation } from 'react-i18next'

import { PenIcon } from '@/shared/ui'
import { cn } from '@/shared/library/utils'

interface Props {
  className?: string
}

export const AddListingButton: React.FC<Props> = ({ className }) => {
  const { t, i18n } = useTranslation()
  return (
    <>
      <button
        className={cn(
          `relative flex h-[53px] min-w-[267px] items-center gap-6 rounded-[60px] bg-primary-900 py-[5px] pr-[5px] text-base/4 text-gray-50 transition-colors duration-300 hover:bg-primary-500 active:bg-primary-600 active:duration-0 ${i18n.language !== 'uk' ? 'xl:pl-[37px]' : 'xl:pl-[20px]'}`,
          className,
        )}
      >
        <span className='mr-7 flex flex-1 items-center justify-center xl:mr-12'>
          {t('buttons.addAdvert')}
        </span>
        <span className='absolute right-[5px] flex size-[43px] items-center justify-center rounded-full bg-gray-50 text-foreground'>
          <PenIcon />
        </span>
      </button>
    </>
  )
}
