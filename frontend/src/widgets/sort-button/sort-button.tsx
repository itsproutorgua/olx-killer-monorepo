import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/shadcn-ui/select'
import { CheckedIcon } from '@/shared/ui'

export const SortButton = () => {
  const { t } = useTranslation()
  const [value, setValue] = useState('rating')

  const SORT: Record<string, string> = {
    cheap: t('sort.priceCheap'),
    expensive: t('sort.priceExpensive'),
    new: t('sort.novelties'),
    rating: t('sort.rating'),
  }

  return (
    <Select value={value} onValueChange={setValue}>
      <SelectTrigger className='h-auto w-[172px] rounded-lg border border-gray-200 bg-gray-50 text-start text-[13px]/[24px] font-normal xl:w-[250px]'>
        <SelectValue aria-label={value}>{SORT[value]}</SelectValue>
      </SelectTrigger>

      <SelectContent
        sideOffset={13}
        className='rounded-lg border border-border bg-background p-0 py-1 shadow-none'
      >
        {Object.entries(SORT).map(([key, value]) => (
          <SelectItem
            key={key}
            value={key}
            className='related group w-[250px] px-[14px] py-2.5 data-[state=checked]:bg-gray-50 data-[state=checked]:text-foreground'
          >
            {value}
            <span className='absolute right-[14px] top-1/2 -translate-y-1/2 group-data-[state=unchecked]:hidden'>
              <CheckedIcon />
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
