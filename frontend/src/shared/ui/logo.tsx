import React from 'react'
import { Link } from 'react-router-dom'

import { MainLogo } from '@/shared/ui/icons/mainLogo.tsx'
import { cn } from '@/shared/library/utils'

interface LogoProps {
  className?: string
}

export const Logo: React.FC<LogoProps> = ({ className }) => {
  return (
    <Link to='/' className={cn(className)}>
      <MainLogo />
    </Link>
  )
}
