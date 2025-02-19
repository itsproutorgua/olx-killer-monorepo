import React from 'react'
import { Link } from 'react-router-dom'

import { Button } from '@/shared/ui/shadcn-ui/button.tsx'
import { DangerTriangleIcon } from '@/shared/ui/icons'
import { PRIVATE_PAGES } from '@/shared/constants'
import { cn } from '@/shared/library/utils'

interface Props {
  className?: string
}

export const ProfileNotFilled: React.FC<Props> = ({ className }) => {
  return (
    <div className={cn('rounded-[10px] bg-error-200 p-6', className)}>
      <h3 className='flex items-center gap-4 text-sm font-medium'>
        <DangerTriangleIcon />
        <span className='text-black'>Ваш профіль заповнений на 60%</span>
      </h3>
      <p className='mt-[10px] text-xs text-gray-800 xl:text-sm'>
        Для публікації оголошення необхідно заповнити профіль. Це займе всього
        кілька хвилин.
      </p>
      <Link to={`${PRIVATE_PAGES.PROFILE}`}>
        <Button className='mt-5 h-[42px] rounded-[60px] bg-primary-900 px-[45px] py-[13px] leading-4 text-gray-50'>
          Перейти у профіль
        </Button>
      </Link>
    </div>
  )
}
