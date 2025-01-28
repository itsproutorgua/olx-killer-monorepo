import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { getSortOptions } from '@/features/sort-button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/shadcn-ui/select'
import { CheckedIcon } from '@/shared/ui/icons'
import { SortEnum } from '@/shared/constants/app.const'
import { useQueryParams } from '@/shared/library/hooks'

export const SortButton = () => {
  const { t } = useTranslation()
  const { setQueryParam, getQueryParamByKey } = useQueryParams()
  const SORT_OPTIONS = useMemo(() => getSortOptions(t), [t])

  const [value, setValue] = useState(
    SORT_OPTIONS[SortEnum.CREATED_AT_DESC].value,
  )

  const onValueChange = (value: SortEnum) => {
    setValue(value)
    setQueryParam('sort', value)
  }

  useEffect(() => {
    const sort = getQueryParamByKey('sort') as SortEnum
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
            onClick={event => {
              event.stopPropagation()
              event.preventDefault()
            }}
            className='group px-[14px] py-2.5 text-[13px]/[24px] font-normal hover:bg-primary-100 data-[state=checked]:cursor-default data-[state=checked]:bg-gray-50 data-[state=checked]:text-foreground xl:text-base'
          >
            <div className='flex flex-row gap-4'>
              {SORT_OPTIONS[value.value].label}

              <span className='group-data-[state=unchecked]:hidden'>
                <CheckedIcon className='size-5' />
              </span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
