'use client'

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
import { Input } from '@/shared/ui/shadcn-ui/input'
import { SearchIcon } from '@/shared/ui'

const FormSchema = z.object({
  text: z.string().min(3, {
    message: 'Text must be at least 3 characters.',
  }),
})

export function ChatSearch() {
  const { t } = useTranslation()

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      text: '',
    },
  })

  function onSubmit(data: z.infer<typeof FormSchema>) {
    console.log(data)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name='text'
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className='relative'>
                  <Input
                    {...field}
                    placeholder={t('chat.searchPlaceholder')}
                    className='h-[46px] rounded-[127px] border-border px-[22px] text-[13px]/[15.73px]'
                  />
                  <SearchIcon className='absolute right-[22px] top-1/2 -translate-y-1/2 transform text-gray-950' />
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
