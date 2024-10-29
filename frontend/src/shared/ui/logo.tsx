import { Link } from 'react-router-dom'
import React from "react";
import {cn} from "@/shared/library/utils";

interface LogoProps {
  className?: string
}

export const Logo: React.FC<LogoProps> = ({className}) => {
  return (
    <Link
      to='/'
      className={cn(
        'hidden text-[32px] font-semibold text-gray-50 xl:inline-block',
        className,
      )}
    >
      OLX Killer
    </Link>
  )
}
