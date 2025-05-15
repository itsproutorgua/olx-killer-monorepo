import React from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import { LongArrowAltRightIcon } from '@/shared/ui'
import { cn } from '@/shared/library/utils'

interface Props {
  className?: string
}

export const BackToListingsButton: React.FC<Props> = ({ className }) => {
  const { t, i18n } = useTranslation()
  return (
    <>
      <Link
        to='/'
        className={cn(
          `relative flex h-[53px] min-w-[267px] items-center gap-6 rounded-[60px] bg-primary-900 py-[5px] pl-6 pr-[5px] text-base/4 text-gray-50 transition-colors duration-300 hover:bg-primary-500 active:bg-primary-600 active:duration-0 ${i18n.language !== 'uk' ? 'xl:pl-[37px]' : 'xl:pl-[20px]'}`,
          className,
        )}
      >
        <span className='mr-14 flex flex-1 items-center justify-center xl:mr-14'>
          {t('buttons.backToListings')}
        </span>
        <span className='absolute right-[5px] flex size-[43px] items-center justify-center rounded-full bg-gray-50 text-foreground'>
          <LongArrowAltRightIcon />
        </span>
      </Link>
    </>
  )
}
