import { useEffect } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
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

const FormSchema = z.object({
  price: z.array(z.number()),
})

export const PriceForm = () => {
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

  useEffect(() => {
    const price = getQueryParamByKey(FilterEnum.PRICE)

    if (price) {
      form.setValue('price', price.split('-').map(Number))
    } else {
      form.setValue('price', [40, 40000])
    }
  }, [form, getQueryParamByKey])

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
                        type='text'
                        value={String(value[0])}
                        onChange={e =>
                          onChange([Number(e.target.value), value[1]])
                        }
                        className='inline-block w-[71px] rounded-lg border border-gray-300 bg-background py-[7px] text-center text-base/5 placeholder:text-gray-400 focus:border-primary-900 focus:outline-none'
                      />
                      <Separator className='w-[14px] bg-gray-200' />
                      <input
                        type='text'
                        value={String(value[1])}
                        onChange={e =>
                          onChange([value[0], Number(e.target.value)])
                        }
                        className='inline-block w-[71px] rounded-lg border border-gray-300 bg-background py-[7px] text-center text-base/5 placeholder:text-gray-400 focus:border-primary-900 focus:outline-none'
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
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  )
}
