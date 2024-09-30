import React from 'react'
import { cn } from '@/shared/library/utils'

import { HeartIcon } from '@/shared/ui'

interface Props {
  className?: string
}

export const FavoriteButton: React.FC<React.PropsWithChildren<Props>> = ({
  className,
}) => {
  return (
    <button className={cn('btn-icon', className)}>
      <HeartIcon />
    </button>
  )
}
