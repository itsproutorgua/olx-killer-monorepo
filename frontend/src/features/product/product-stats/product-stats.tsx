import React from 'react'

import { HeartIcon } from '@/shared/ui'
import { MessagesCountIcon, ViewIcon } from '@/shared/ui/icons'
import { cn } from '@/shared/library/utils'

interface ProductStatsProps {
  messagesCount: number
  views: number
  likes: number
  className?: string
}

export const ProductStats: React.FC<ProductStatsProps> = ({
  messagesCount,
  views,
  likes,
  className,
}) => {
  return (
    <div
      className={cn(
        'mb-[14px] flex justify-between text-xs leading-none',
        className,
      )}
    >
      <div className='flex items-center justify-center gap-[6px]'>
        <MessagesCountIcon className='w-[18px] xl:h-[18px]' />
        <span>{messagesCount}</span>
      </div>
      <div className='flex items-center justify-center gap-[6px]'>
        <ViewIcon className='w-[18px] xl:h-[18px]' />
        <span>{views}</span>
      </div>
      <div className='flex items-center justify-center gap-[6px]'>
        <HeartIcon
          width='16px'
          height='16px'
          className='w-[18px] xl:h-[18px]'
        />
        <span>{likes}</span>
      </div>
    </div>
  )
}
