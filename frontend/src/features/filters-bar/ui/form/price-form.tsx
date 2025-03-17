import { useEffect, useRef } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { z } from 'zod'

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/shared/ui/shadcn-ui/form'
import { Separator } from '@/shared/ui/shadcn-ui/separator'
import { Slider } from '@/shared/ui/shadcn-ui/slider'
import { FilterEnum } from '@/shared/constants/app.const'
import { useQueryParams } from '@/shared/library/hooks'

const usePriceFormSchema = () => {
  const { t } = useTranslation()
  return z.object({
    price: z
      .array(z.number())
      .length(2) // Ensure exactly two numbers are provided
      .refine(([min, max]) => min <= max, {
        message: t('filters.priceError'),
      }),
  })
}

export const PriceForm = () => {
  const FormSchema = usePriceFormSchema()
  const { setQueryParams, getQueryParamByKey } = useQueryParams()
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      price: [40, 40000],
    },
  })

  function onSubmit(data: z.infer<typeof FormSchema>) {
    setQueryParams({
      [FilterEnum.PRICE]: String(data.price.join('-')),
    })
  }

  const prevPriceRef = useRef<string | null>(null)
  const priceParam = getQueryParamByKey(FilterEnum.PRICE)

  useEffect(() => {
    // Only update the form if the price param exists and is different from the previous one
    if (priceParam && priceParam !== prevPriceRef.current) {
      const parsedPrice = priceParam
        .split('-')
        .map(Number)
        .filter(val => val >= 0)

      form.setValue(
        'price',
        parsedPrice.length === 2 ? parsedPrice : [40, 40000],
      )
    }
    // Reset the form when price param is removed
    else if (!priceParam && prevPriceRef.current) {
      form.resetField('price')
    }

    // Update the previous price ref
    prevPriceRef.current = priceParam
  }, [priceParam, form])

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name='price'
          render={({ field: { value, onChange } }) => (
            <FormItem>
              <FormControl>
                <div className='space-y-4'>
                  <div className='flex items-center justify-between'>
                    <div className='flex items-center gap-2'>
                      <input
                        type='number'
                        value={String(value[0])}
                        onChange={e =>
                          onChange([Number(e.target.value), value[1]])
                        }
                        className='no-spinner inline-block w-[71px] rounded-lg border border-gray-300 bg-background py-[7px] text-center text-base/5 placeholder:text-gray-400 focus:border-primary-900 focus:outline-none'
                      />
                      <Separator className='w-[14px] bg-gray-200' />
                      <input
                        type='number'
                        value={String(value[1])}
                        onChange={e =>
                          onChange([value[0], Number(e.target.value)])
                        }
                        className='no-spinner inline-block w-[71px] rounded-lg border border-gray-300 bg-background py-[7px] text-center text-base/5 placeholder:text-gray-400 focus:border-primary-900 focus:outline-none'
                      />
                    </div>
                    <button
                      type='submit'
                      className='flex h-[34px] w-[43px] items-center justify-center rounded-lg border border-gray-300 bg-background text-base/5 transition-colors duration-300 hover:border-primary-900 hover:bg-primary-100'
                    >
                      ОК
                    </button>
                  </div>
                  <Slider
                    value={form.getValues('price')}
                    min={0}
                    max={40000}
                    step={10}
                    minStepsBetweenThumbs={10}
                    onValueChange={values => onChange(values)}
                  />
                </div>
              </FormControl>
              <FormMessage className='pt-2' />
            </FormItem>
          )}
        />
      </form>
    </Form>
  )
}
