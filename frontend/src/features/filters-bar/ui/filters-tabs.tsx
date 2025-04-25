import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { useFilters } from '@/entities/filter'
import type { Filters } from '@/entities/filter/library/hooks/use-filters'
import { ScrollArea } from '@/shared/ui/shadcn-ui/scroll-area'
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
import { FiltersTabsFooter } from './filters-tabs-footer'
import { FiltersTabsHeader } from './filters-tabs-header'

export const FiltersTabs = ({ onCloseSheet }: { onCloseSheet: () => void }) => {
  const { t } = useTranslation()
  const [value, setValue] = useState('')
  const { filters } = useFilters()

  return (
    <Tabs orientation='vertical' value={value} onValueChange={setValue}>
      <ScrollArea className='h-full'>
        <TabsList className='flex h-auto flex-col items-start rounded-none bg-background p-0'>
          {FILTERS.map(filter => (
            <TabsTrigger
              key={filter.name}
              value={filter.name}
              className='flex w-full items-center justify-between border-b border-gray-200 py-[14px] text-base/5 font-medium text-foreground'
            >
              {t(filter.label)}

              <span className='flex items-center gap-2 text-sm font-normal text-gray-400'>
                {filters[filter.name as keyof Filters] ? (
                  <span className='capitalize'>
                    {t(
                      filter.items.find(
                        item =>
                          item.value === filters[filter.name as keyof Filters],
                      )?.label || 'words.all',
                    )}
                  </span>
                ) : (
                  <span>{t('words.all')}</span>
                )}

                <ChevronRightIcon />
              </span>
            </TabsTrigger>
          ))}
        </TabsList>
      </ScrollArea>

      {FILTERS.map(filter => (
        <TabsContent
          key={filter.name}
          value={filter.name}
          className={cn(
            'absolute right-0 top-0 m-0 h-full w-full bg-background px-2.5 data-[state=active]:translate-x-0 data-[state=inactive]:translate-x-[380px]',
          )}
        >
          <div className='grid h-full grid-rows-[auto_1fr_auto]'>
            <FiltersTabsHeader label={filter.label} setValue={setValue} />
            <FiltersTabsContent filter={filter} />
            <FiltersTabsFooter onBack={setValue} onShow={onCloseSheet} />
          </div>
        </TabsContent>
      ))}
    </Tabs>
  )
}
