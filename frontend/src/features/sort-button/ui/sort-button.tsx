import { useEffect, useState } from 'react'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/shadcn-ui/select'
import { CheckedIcon } from '@/shared/ui/icons'
import { useQueryParams } from '@/shared/library/hooks'
import { SORT_OPTIONS, type SortValue } from '../model'

export const SortButton = () => {
  const { setQueryParam, getQueryParamByKey } = useQueryParams()
  const [value, setValue] = useState(SORT_OPTIONS['created_at:desc'].value)

  const onValueChange = (value: SortValue) => {
    setValue(value)
    setQueryParam('sort', value)
  }

  useEffect(() => {
    const sort = getQueryParamByKey('sort') as SortValue
    if (sort && SORT_OPTIONS[sort]) {
      setValue(sort)
    }
  }, [getQueryParamByKey])

  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className='h-11 w-full rounded-lg border border-border bg-background text-start text-[13px]/[24px] font-normal shadow-[0_4px_6px_-2px_rgba(16,24,40,0.05)] transition-colors duration-300 hover:border-primary-200 hover:bg-gray-100 focus:ring-0 data-[state=open]:border-primary-200 data-[state=open]:bg-gray-100 xl:w-[250px] xl:text-base'>
        <SelectValue aria-label={value}>
          {SORT_OPTIONS[value].label}
        </SelectValue>
      </SelectTrigger>

      <SelectContent
        position='popper'
        sideOffset={3}
        sticky='partial'
        className='rounded-lg border border-primary-50 bg-background p-0 py-1 shadow-[0_1px_2px_0_rgba(16,24,40,0.03)]'
      >
        {Object.entries(SORT_OPTIONS).map(([key, value]) => (
          <SelectItem
            key={key}
            value={value.value}
            className='related group px-[14px] py-2.5 text-[13px]/[24px] font-normal hover:bg-primary-100 data-[state=checked]:cursor-default data-[state=checked]:bg-gray-50 data-[state=checked]:text-foreground xl:text-base'
          >
            {SORT_OPTIONS[value.value].label}

            <span className='absolute right-[14px] top-1/2 -translate-y-1/2 group-data-[state=unchecked]:hidden'>
              <CheckedIcon className='size-5' />
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
