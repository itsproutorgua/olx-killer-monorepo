import { useState } from 'react'
import { Link } from 'react-router-dom'

import type { CategoryChild } from '@/entities/category'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/shared/ui/shadcn-ui/collapsible'
import { PUBLIC_PAGES } from '@/shared/constants'

export const CategoryNavbarCollapsible = ({
  data,
}: {
  data: CategoryChild[]
}) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className='mb-5 md:hidden'
    >
      <ul className='grid grid-cols-2 border-t border-t-gray-200'>
        {data.slice(0, 6).map(item => {
          const href = `${PUBLIC_PAGES.CATALOG}/${item.path}`

          return (
            <li
              key={item.path}
              className='border-b border-gray-200 odd:border-r'
            >
              <Link
                to={href}
                className='flex items-center gap-3 p-2.5 text-[13px]/[15.73px]'
              >
                {item.img ? (
                  <img
                    src={item.img}
                    alt={item.title}
                    className='block size-[34px] rounded-full bg-gray-400 object-contain'
                  />
                ) : (
                  <div className='size-[34px] flex-none rounded-full bg-gray-400' />
                )}

                <p>{item.title}</p>
              </Link>
            </li>
          )
        })}
      </ul>

      <CollapsibleContent>
        <ul className='grid grid-cols-2'>
          {data.slice(6).map(item => {
            const href = `${PUBLIC_PAGES.CATALOG}/${item.path}`

            return (
              <li
                key={item.path}
                className='border-b border-gray-200 odd:border-r'
              >
                <Link
                  to={href}
                  className='flex items-center gap-3 p-2.5 text-[13px]/[15.73px]'
                >
                  {item.img ? (
                    <img
                      src={item.img}
                      alt={item.title}
                      className='block size-[34px] rounded-full bg-gray-400 object-contain'
                    />
                  ) : (
                    <div className='size-[34px] flex-none rounded-full bg-gray-400' />
                  )}

                  <p>{item.title}</p>
                </Link>
              </li>
            )
          })}
        </ul>
      </CollapsibleContent>

      <CollapsibleTrigger className='mt-[22px] w-full rounded-full border border-gray-200 py-[13px] text-center text-[13px]/[15.73px] font-medium'>
        {isOpen ? 'Hide categories' : 'Open more categories'}
      </CollapsibleTrigger>
    </Collapsible>
  )
}
