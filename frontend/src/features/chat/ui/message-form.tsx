'use client'

import { useEffect } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useLocation } from 'react-router-dom'
import TextareaAutosize from 'react-textarea-autosize'
import { z } from 'zod'

import { useChatContext } from '@/features/chat/chat-context/chat-context.tsx'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
} from '@/shared/ui/shadcn-ui/form'
import { AttachIcon, SendIcon } from '@/shared/ui/icons'
import { useMediaQuery } from '@/shared/library/hooks'
import { setViewportForIOS } from '@/shared/library/utils/viewportAutozoom.ts'

const FormSchema = z.object({
  msg: z
    .string()
    .min(1, {
      message: 'Message must be at least 2 characters.',
    })
    .max(500, {
      message: 'Message must not be longer than 1000 characters.',
    }),
})

export function MessageForm() {
  const { sendMessage } = useChatContext()
  const { t } = useTranslation()
  const isDesktop = useMediaQuery('(min-width: 1440px)')
  const minRows = isDesktop ? 6 : 1

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  })

  const location = useLocation()
  const prefill = location.state?.prefill

  useEffect(() => {
    if (prefill) {
      form.setValue('msg', prefill)
    }
  }, [prefill])

  // Viewport meta tag for iOS on mount
  useEffect(() => {
    setViewportForIOS()
  }, [])

  const handleSubmit = (data: z.infer<typeof FormSchema>) => {
    sendMessage(data.msg)
    form.reset({ msg: '' })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className='relative'>
        <FormField
          control={form.control}
          name='msg'
          render={({ field }) => (
            <FormItem className='space-y-0 leading-[0px]'>
              <FormControl>
                <div className='relative'>
                  <TextareaAutosize
                    placeholder={t('chat.writeMsg')}
                    minRows={minRows}
                    maxRows={6}
                    className='box-border w-full resize-none scroll-pb-5 rounded-none border-0 bg-transparent px-[52px] py-5 text-[13px] leading-[20px] [-webkit-text-size-adjust:100%] focus:border-transparent focus:outline-none focus:ring-0 xl:px-6 xl:py-6 xl:pr-[120px] xl:text-[13px]'
                    {...field}
                  />
                  {/* Gradient overlays */}
                  <div className='pointer-events-none absolute inset-0 flex flex-col justify-between pr-4'>
                    <div className='h-6 bg-gradient-to-b from-background to-transparent' />
                    <div className='h-6 bg-gradient-to-t from-background to-transparent' />
                  </div>
                </div>
              </FormControl>
            </FormItem>
          )}
        />
        <button
          type='button'
          className='absolute bottom-6 left-3 size-5 text-primary-400 xl:hidden'
        >
          <AttachIcon />
        </button>
        <div className='absolute bottom-[14px] right-3 flex items-center gap-5 xl:bottom-[100px] xl:right-6'>
          <button
            type='button'
            className='hidden size-5 text-primary-400 xl:block xl:size-6'
          >
            <AttachIcon />
          </button>
          <button
            type='submit'
            className='flex size-8 items-center justify-center rounded-full bg-primary-900 text-background xl:size-[52px]'
          >
            <SendIcon className='h-4 w-4 xl:h-6 xl:w-6' />
          </button>
        </div>
      </form>
    </Form>
  )
}
