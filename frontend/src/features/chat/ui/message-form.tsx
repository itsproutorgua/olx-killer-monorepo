'use client'

import { useEffect, useRef } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate } from 'react-router-dom'
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
  } = useChatContext()

  const { t } = useTranslation()
  const isDesktop = useMediaQuery('(min-width: 1440px)')
  const minRows = isDesktop ? 6 : 1

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: { msg: '' },
  })

  const location = useLocation()
  const navigate = useNavigate()
  const prefill = location.state?.prefill

  // Track prefill application per room
  const prefillAppliedRef = useRef<{ roomId: string | null; applied: boolean }>(
    {
      roomId: null,
      applied: false,
    },
  )

  // Handle prefill logic
  useEffect(() => {
    if (
      prefill &&
      !editingMessage &&
      currentRoomId &&
      prefillAppliedRef.current.roomId !== currentRoomId
    ) {
      form.setValue('msg', prefill)
      prefillAppliedRef.current = { roomId: currentRoomId, applied: true }

      // Attempt to clear prefill from router state
      navigate(location.pathname, {
        replace: true,
        state: {
          roomId: currentRoomId,
          mobileView: location.state?.mobileView,
        },
      })
    }
  }, [prefill, editingMessage, currentRoomId, location, navigate])

  // Handle edit mode population
  useEffect(() => {
    if (editingMessage) {
      form.setValue('msg', editingMessage.text)
    }
  }, [editingMessage])

  // Reset form when switching rooms
  useEffect(() => {
    // Skip reset if prefill was just applied for the current room
    if (
      prefillAppliedRef.current.applied &&
      prefillAppliedRef.current.roomId === currentRoomId
    ) {
      return
    }

    // Reset form
    form.reset({ msg: '' })
    form.setValue('msg', '')
    if (editingMessage) {
      setEditingMessage(null)
    }
    prefillAppliedRef.current = { roomId: null, applied: false }
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
    prefillAppliedRef.current = { roomId: null, applied: false }
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
