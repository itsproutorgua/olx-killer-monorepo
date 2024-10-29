import { Link } from 'react-router-dom'

import type { CategoryChild } from '@/entities/category'

export const CategoryNavbarItem = ({
  item,
  href,
}: {
  item: CategoryChild
  href: string
}) => {
  return (
    <Link
      to={href}
      className='flex items-center gap-3 p-2.5 xl:flex-col xl:gap-4 xl:p-0'
    >
      {item.img ? (
        <img
          src={item.img}
          alt={item.title}
          className='block size-[34px] rounded-full bg-gray-400 object-contain xl:size-[150px]'
        />
      ) : (
        <div className='size-[34px] flex-none rounded-full bg-gray-400 xl:size-[150px]' />
      )}

      <p className='text-[13px]/[15.73px] xl:line-clamp-1 xl:text-center xl:text-base/[19px]'>
        {item.title}
      </p>
    </Link>
  )
}
