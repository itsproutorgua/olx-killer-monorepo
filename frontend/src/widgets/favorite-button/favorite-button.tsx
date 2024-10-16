import { HeartIcon } from '@/shared/ui/icons'
import React from "react";

interface Props {
  className?: string
}

export const FavoriteButton: React.FC<Props> = ({ className }) => {
  return (
    <div className={className}>
      <button className="group flex size-11 items-center justify-center text-gray-50 transition-colors duration-300">
        <HeartIcon className="h-6 w-6 fill-primary-900 transition-colors duration-300 group-hover:fill-primary-50"/>
      </button>
    </div>
  )
}
