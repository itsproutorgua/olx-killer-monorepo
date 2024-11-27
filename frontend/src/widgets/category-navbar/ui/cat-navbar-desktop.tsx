import { Link } from 'react-router-dom'

import type { CategoryChild } from '@/entities/category'

export const CategoryNavbarDesktop = ({ data }: { data: CategoryChild[] }) => {
  return (
    <ul className='hidden grid-cols-4 gap-x-12 gap-y-2.5 overflow-hidden border-b border-border pb-5 xl:grid'>
      {data.map(cat => (
        <li
          key={cat.path}
          className='relative after:absolute after:-right-6 after:top-0 after:h-40 after:w-px after:bg-border [&nth-child(4n)]:after:hidden'
        >
          <Link
            to={cat.path}
            className='line-clamp-1 text-sm font-medium transition-colors duration-300 hover:text-primary-600'
          >
            {cat.title} ({cat.products_cumulative_count})
          </Link>
        </li>
      ))}
    </ul>
  )
}
