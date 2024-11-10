import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/shared/ui/shadcn-ui/tabs'
import { ChevronRightIcon } from '@/shared/ui'
import { cn } from '@/shared/library/utils'
import { FILTERS } from '../mock'
import { FiltersTabsContent } from './filters-tabs-content'
import { FiltersTabsHeader } from './filters-tabs-header'

export const FiltersTabs = () => {
  const { t } = useTranslation()
  const [value, setValue] = useState('')

  return (
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
              <span className='text-sm font-normal text-gray-400'>
                {t('words.all')}
              </span>
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
            <FiltersTabsHeader label={filter.label} setValue={setValue} />
            <FiltersTabsContent filter={filter} />
          </div>
        </TabsContent>
      ))}
    </Tabs>
  )
}
