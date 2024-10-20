import { useState } from 'react'

import type { CategoryChild } from '@/entities/category'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/shared/ui/shadcn-ui/collapsible'
import { PUBLIC_PAGES } from '@/shared/constants'
import { CategoryNavbarItem } from './cat-navbar-item'

export const CategoryNavbarMobile = ({ data }: { data: CategoryChild[] }) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className='space-y-5 md:hidden'
    >
      <div>
        <ul className='grid grid-cols-2 border-t border-t-gray-200'>
          {data.slice(0, 6).map(item => {
            const href = `${PUBLIC_PAGES.CATALOG}/${item.path}`

            return (
              <li
                key={item.path}
                className='border-b border-gray-200 odd:border-r'
              >
                <CategoryNavbarItem item={item} href={href} />
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
                  <CategoryNavbarItem item={item} href={href} />
                </li>
              )
            })}
          </ul>
        </CollapsibleContent>
      </div>
      {/* text-[13px]/[15.73px] */}
      {data.length > 6 && (
        <CollapsibleTrigger className='btn-secondary'>
          {isOpen
            ? 'Hide categories'
            : `Open ${data.length - 6} more categories`}
        </CollapsibleTrigger>
      )}
    </Collapsible>
  )
}
