import React from 'react'

import { HeartIcon } from '@/shared/ui'
import { cn } from '@/shared/lib/utils'

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
