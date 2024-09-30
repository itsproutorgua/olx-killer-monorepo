import { useState } from 'react'
import { cn } from '@/shared/library/utils'

import { Checkbox } from '@/shared/ui/shadcn-ui/checkbox'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/shared/ui/shadcn-ui/tabs'
import { ChevronLeftIcon, ChevronRightIcon } from '@/shared/ui'
import { FILTERS } from '../mock'

export const FiltersMobile = () => {
  const [value, setValue] = useState('')

  return (
    <div className='md:hidden'>
      <Tabs orientation='vertical' value={value} onValueChange={setValue}>
        <TabsList className='flex h-auto flex-col items-start rounded-none bg-background p-0'>
          {FILTERS.map(filter => (
            <TabsTrigger
              key={filter.name}
              value={filter.name}
              className='flex w-full items-center justify-between border-b border-gray-200 py-[14px] text-base/5 font-medium text-foreground'
            >
              {filter.label}

              <span className='flex items-center gap-2'>
                <span className='text-sm font-normal text-gray-400'>All</span>
                <ChevronRightIcon />
              </span>
            </TabsTrigger>
          ))}
        </TabsList>
        {FILTERS.map(filter => (
          <TabsContent
            key={filter.name}
            value={filter.name}
            className={cn(
              'absolute right-0 top-0 m-0 h-full w-full bg-background px-2.5 data-[state=active]:translate-x-0 data-[state=inactive]:translate-x-[380px]',
            )}
          >
            <div className='grid h-screen grid-rows-[auto_1fr_auto]'>
              {/* Header */}
              <div className='flex items-center justify-between border-b border-gray-200 py-7'>
                <button
                  onClick={() => setValue('')}
                  className='flex items-center gap-2 text-2xl/none text-foreground'
                >
                  <ChevronLeftIcon />
                  {filter.label}
                </button>
              </div>

              {/* Content */}
              <div className='pt-[11px]'>
                {filter.type === 'Checkbox' && (
                  <ul className='space-y-3'>
                    {filter.items.map(item => (
                      <li key={item.label} className='flex items-center gap-2'>
                        <Checkbox id={item.label} />
                        <label
                          htmlFor={item.label}
                          className='text-sm font-normal'
                        >
                          {item.label}
                        </label>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Footer */}
              <div className='space-y-4 pb-2.5 pt-4'>
                <p className='text-center text-[13px]/[15.6px] text-gray-400'>
                  Find 200 announcements
                </p>
                <div className='grid grid-cols-2 gap-2.5'>
                  <button
                    onClick={() => setValue('')}
                    className='btn-secondary'
                  >
                    Back to
                  </button>
                  <button className='btn-primary'>Show</button>
                </div>
              </div>
            </div>

            {filter.label}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
