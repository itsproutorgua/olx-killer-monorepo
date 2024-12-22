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
} from '@/shared/ui/shadcn-ui/form'
import { Textarea } from '@/shared/ui/shadcn-ui/textarea'
import { AttachIcon, SendIcon } from '@/shared/ui/icons'

const FormSchema = z.object({
  msg: z
    .string()
    .min(2, {
      message: 'Message must be at least 2 characters.',
    })
    .max(1000, {
      message: 'Message must not be longer than 1000 characters.',
    }),
})

export function MessageForm() {
  const { t } = useTranslation()

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  })

  function onSubmit(data: z.infer<typeof FormSchema>) {
    console.log(data)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='relative'>
        <FormField
          control={form.control}
          name='msg'
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea
                  placeholder={t('chat.writeMsg')}
                  className='text-[13px]/ [19.5px] h-[156px] resize-none rounded-none border-0 p-6'
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <div className='absolute right-6 top-6 flex items-center gap-5'>
          <button type='button' className='text-primary-400'>
            <AttachIcon />
          </button>
          <button
            type='submit'
            className='flex size-[52px] items-center justify-center rounded-full bg-primary-900 text-background'
          >
            <SendIcon />
          </button>
        </div>
      </form>
    </Form>
  )
}
