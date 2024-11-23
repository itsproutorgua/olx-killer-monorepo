import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router-dom'

import { SortEnum, type Sort } from '@/entities/product'
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
  const [searchParams, setSearchParams] = useSearchParams()

  const SORT: Record<string, string> = useMemo(
    () => ({
      'price:desc': t('sort.priceCheap'),
      'price:asc': t('sort.priceExpensive'),
      'created_at:desc': t('sort.novelties'),
      rating: t('sort.rating'),
    }),
    [t],
  )

  const [value, setValue] = useState(SortEnum.RATING)

  const onValueChange = (value: Sort) => {
    setValue(value)
    setSearchParams({ sort: value })
  }

  useEffect(() => {
    const sort = searchParams.get('sort') as Sort
    if (sort && SORT[sort]) {
      setValue(sort)
    }
  }, [SORT, searchParams])

  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className='h-auto w-[172px] rounded-lg border border-gray-200 bg-gray-50 text-start text-[13px]/[24px] font-normal xl:w-[250px]'>
        <SelectValue aria-label={value}>{SORT[value]}</SelectValue>
      </SelectTrigger>

      <SelectContent
        sideOffset={13}
        className='rounded-lg border border-border bg-background p-0 py-1 shadow-none'
      >
        {Object.entries(SortEnum).map(([key, value]) => (
          <SelectItem
            key={key}
            value={value}
            className='related group w-[250px] px-[14px] py-2.5 data-[state=checked]:bg-gray-50 data-[state=checked]:text-foreground'
          >
            {SORT[value]}
            <span className='absolute right-[14px] top-1/2 -translate-y-1/2 group-data-[state=unchecked]:hidden'>
              <CheckedIcon />
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
