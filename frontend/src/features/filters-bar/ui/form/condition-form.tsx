'use client'

import { useEffect } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { z } from 'zod'

import { Checkbox } from '@/shared/ui/shadcn-ui/checkbox'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shared/ui/shadcn-ui/form'
import { FilterEnum } from '@/shared/constants/app.const'
import { useQueryParams } from '@/shared/library/hooks'

const ConditionEnum = ['all', 'new', 'used'] as const
const FormSchema = z.object({
  condition: z.enum(ConditionEnum, { message: 'Invalid condition' }),
})

export function ConditionForm() {
  const { t } = useTranslation()
  const { setQueryParams, getQueryParamByKey, removeQueryParamByKey } =
    useQueryParams()

  const ConditionItems: {
    value: (typeof ConditionEnum)[number]
    label: string
  }[] = [
    {
      value: 'all',
      label: t('filters.condition.all'),
    },
    {
      value: 'new',
      label: t('filters.condition.new'),
    },
    {
      value: 'used',
      label: t('filters.condition.used'),
    },
  ]

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      condition: 'all',
    },
  })

  function onSubmit(data: z.infer<typeof FormSchema>) {
    if (data.condition === 'all') {
      removeQueryParamByKey([FilterEnum.STATUS])
    } else {
      setQueryParams({ [FilterEnum.STATUS]: data.condition })
    }
  }

  useEffect(() => {
    const condition = getQueryParamByKey(FilterEnum.STATUS)
    if (condition) {
      form.setValue('condition', condition as (typeof ConditionEnum)[number])
    } else {
      form.setValue('condition', 'all')
    }
  }, [form, getQueryParamByKey])

  return (
    <Form {...form}>
      <form onChange={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name='condition'
          render={() => (
            <FormItem className='space-y-2'>
              {ConditionItems.map(item => (
                <FormField
                  key={item.value}
                  control={form.control}
                  name='condition'
                  render={({ field }) => {
                    return (
                      <FormItem
                        key={item.value}
                        className='flex items-center gap-2 space-y-0'
                      >
                        <FormControl>
                          <Checkbox
                            checked={field.value === item.value}
                            onCheckedChange={checked => {
                              form.setValue(
                                'condition',
                                checked ? item.value : 'all',
                              )
                            }}
                          />
                        </FormControl>
                        <FormLabel className='text-sm font-medium'>
                          {item.label}
                        </FormLabel>
                      </FormItem>
                    )
                  }}
                />
              ))}
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  )
}
