import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import type { CategoryChild } from '@/entities/category'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/shared/ui/shadcn-ui/collapsible'
import { PUBLIC_PAGES } from '@/shared/constants'
import { CategoryNavbarItem } from './cat-navbar-item'

export const CategoryNavbarDesktop = ({ data }: { data: CategoryChild[] }) => {
  const { t } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className='hidden space-y-9 xl:block'
    >
      <div className='space-y-6'>
        <ul className='grid grid-cols-7 gap-[38px]'>
          {data.slice(0, 7).map(item => {
            const href = `${PUBLIC_PAGES.CATALOG}/${item.path}`

            return (
              <li key={item.path}>
                <CategoryNavbarItem item={item} href={href} />
              </li>
            )
          })}
        </ul>

        <CollapsibleContent>
          <ul className='grid grid-cols-7 gap-[38px]'>
            {data.slice(6).map(item => {
              const href = `${PUBLIC_PAGES.CATALOG}/${item.path}`

              return (
                <li key={item.path}>
                  <CategoryNavbarItem item={item} href={href} />
                </li>
              )
            })}
          </ul>
        </CollapsibleContent>
      </div>

      {data.length > 7 && (
        <CollapsibleTrigger className='btn-secondary'>
          {isOpen ? t('buttons.showLess') : t('buttons.showMore')}
        </CollapsibleTrigger>
      )}
    </Collapsible>
  )
}
