'use client'

import { useEffect } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
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
  msg: z.string().max(500, {
    message: 'Message must not be longer than 1000 characters.',
  }),
})

export function MessageForm() {
  const {
    sendMessage,
    editMessage,
    editingMessage,
    setEditingMessage,
    currentRoomId,
    isConnected,
  } = useChatContext()

  const { t } = useTranslation()
  const isDesktop = useMediaQuery('(min-width: 1440px)')
  const minRows = isDesktop ? 6 : 1

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: { msg: '' },
  })

  const location = useLocation()

  useEffect(() => {
    if (editingMessage) {
      form.setValue('msg', editingMessage.text)
    }
  }, [editingMessage])

  useEffect(() => {
    if (editingMessage) {
      setEditingMessage(null)
    }

    if (location.state?.prefill) {
      form.setValue('msg', location.state.prefill + ' ')
      window.history.replaceState({}, '')
    } else {
      form.reset({ msg: '' })
    }
  }, [currentRoomId])

  // iOS viewport fix
  useEffect(() => {
    setViewportForIOS()
  }, [])

  const handleSubmit = (data: z.infer<typeof FormSchema>) => {
    const trimmedMsg = data.msg.trim()
    if (trimmedMsg.length === 0) {
      toast.error(t('messages.error.emptyEdit'))
      return
    }

    if (editingMessage) {
      editMessage(editingMessage.message_id, trimmedMsg)
      setEditingMessage(null)
    } else {
      sendMessage(trimmedMsg)
    }

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
                <div>
                  {editingMessage && (
                    <div className='bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-100 flex items-center justify-between border-b-[1px] border-primary-400 px-3 py-1 text-sm text-primary-500'>
                      <span>{t('chat.editing')}...</span>
                      <button
                        type='button'
                        onClick={() => {
                          setEditingMessage(null)
                          form.reset({ msg: '' })
                        }}
                        className='ml-4 text-xs text-gray-500 hover:text-primary-900'
                      >
                        {t('buttons.cancel')}
                      </button>
                    </div>
                  )}
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
            disabled={!isConnected}
            className='flex size-8 items-center justify-center rounded-full bg-primary-900 text-background disabled:bg-gray-500 xl:size-[52px]'
          >
            <SendIcon className='h-4 w-4 xl:h-6 xl:w-6' />
          </button>
        </div>
      </form>
    </Form>
  )
}
