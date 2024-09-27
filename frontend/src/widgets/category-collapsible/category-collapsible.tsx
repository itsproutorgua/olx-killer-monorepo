import { useState } from 'react'
import { Link } from 'react-router-dom'

import { WOMEN_CLOTHING } from '@/entities/category/mock'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/shared/ui/shadcn-ui/collapsible'

export const CategoryCollapsible = () => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className='mb-5 md:hidden'
    >
      <ul className='grid grid-cols-2 border-t border-t-border'>
        {WOMEN_CLOTHING.slice(0, 6).map(item => (
          <li key={item.label} className='border-b border-border odd:border-r'>
            <Link
              to={item.href}
              className='flex items-center gap-3 p-2.5 text-[13px]/[15.73px]'
            >
              <img
                src={item.image}
                alt={item.alt}
                className='block size-[34px] rounded-full object-contain'
              />
              <p>{item.label}</p>
            </Link>
          </li>
        ))}
      </ul>
      <CollapsibleContent>
        <ul className='grid grid-cols-2'>
          {WOMEN_CLOTHING.slice(6).map(item => (
            <li
              key={item.label}
              className='border-b border-border odd:border-r'
            >
              <Link
                to={item.href}
                className='flex items-center gap-3 p-2.5 text-[13px]/[15.73px]'
              >
                <img
                  src={item.image}
                  alt={item.alt}
                  className='block size-[34px] rounded-full object-contain'
                />
                <p>{item.label}</p>
              </Link>
            </li>
          ))}
        </ul>
      </CollapsibleContent>

      <CollapsibleTrigger className='mt-[22px] w-full rounded-full border border-border py-[13px] text-center text-[13px]/[15.73px] font-medium'>
        {isOpen ? 'Hide categories' : 'Open more categories'}
      </CollapsibleTrigger>
    </Collapsible>
  )
}
