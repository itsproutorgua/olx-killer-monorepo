import { zodResolver } from '@hookform/resolvers/zod'
import { LoaderCircle } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { z } from 'zod'

import {
  FeedbackFormData,
  useFeedbackSchema,
} from '@/features/account/listings/library/sell-feedback-shema.tsx'
import { Checkbox } from '@/shared/ui/shadcn-ui/checkbox.tsx'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/shadcn-ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/shared/ui/shadcn-ui/form.tsx'
import { Textarea } from '@/shared/ui/shadcn-ui/textarea.tsx'
import { SellFeedbackIcon } from '@/shared/ui/icons'

interface ListingSellFeedbackProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onFormSubmit: (data: FeedbackFormData) => void
}

export function ListingSellFeedback({
  open,
  onOpenChange,
  onFormSubmit,
}: ListingSellFeedbackProps) {
  const { t } = useTranslation()
  const FormSchema = useFeedbackSchema()
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      answer: 'sold',
      description: undefined,
    },
  })

  const isSubmitDisabled = form.formState.isSubmitting

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        aria-describedby={undefined}
        className='w-full max-w-[451px] animate-contentShow gap-[30px] rounded-[20px] border-none bg-gray-50 p-[50px] text-gray-900'
      >
        <DialogHeader>
          <DialogTitle className='flex flex-col items-center gap-5 text-2xl font-medium leading-[29px] text-gray-900'>
            <SellFeedbackIcon className='text-primary-700' />
            <span>{t('title.listingSellFeedback')}</span>
          </DialogTitle>
          <DialogDescription className='text-[16px] font-normal leading-5'>
            {t('listings.sellFeedbackMessage')}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onFormSubmit)}
            className='space-y-[30px]'
          >
            <FormField
              control={form.control}
              name='answer'
              render={({ field }) => (
                <FormItem className='space-y-3 leading-5'>
                  <fieldset className='flex flex-col gap-[10px]'>
                    <FormItem
                      className={`flex items-center gap-[18px] space-y-0 rounded-[6px] border border-gray-200 px-5 py-[14px] ${field.value === 'sold' ? 'bg-primary-500 text-gray-50' : ''}`}
                    >
                      <FormControl>
                        <Checkbox
                          id='status-sold'
                          name='status-sold'
                          checked={field.value === 'sold'}
                          onCheckedChange={checked =>
                            checked && field.onChange('sold')
                          }
                          className='h-5 w-5 rounded-full'
                        />
                      </FormControl>
                      <label className='font-normal' htmlFor='status-sold'>
                        {t('feedbackForm.answer.sold')}
                      </label>
                    </FormItem>
                    <FormItem
                      className={`flex items-center gap-[18px] space-y-0 rounded-[6px] border border-gray-200 px-5 py-[14px] ${field.value === 'sold_elsewhere' ? 'bg-primary-500 text-gray-50' : ''}`}
                    >
                      <FormControl>
                        <Checkbox
                          id='status-sold-elsewhere'
                          name='status-sold-elsewhere'
                          checked={field.value === 'sold_elsewhere'}
                          onCheckedChange={checked =>
                            checked && field.onChange('sold_elsewhere')
                          }
                          className='h-5 w-5 rounded-full'
                        />
                      </FormControl>
                      <label
                        className='font-normal'
                        htmlFor='status-sold-elsewhere'
                      >
                        {t('feedbackForm.answer.sold_elsewhere')}
                      </label>
                    </FormItem>
                    <FormItem
                      className={`flex items-center gap-[18px] space-y-0 rounded-[6px] border border-gray-200 px-5 py-[14px] ${field.value === 'not_sold' ? 'bg-primary-500 text-gray-50' : ''}`}
                    >
                      <FormControl>
                        <Checkbox
                          id='status-not-sold'
                          name='status-not-sold'
                          checked={field.value === 'not_sold'}
                          onCheckedChange={checked =>
                            checked && field.onChange('not_sold')
                          }
                          className='h-5 w-5 rounded-full data-[state=checked]:bg-gray-50'
                        />
                      </FormControl>
                      <label className='font-normal' htmlFor='status-not-sold'>
                        {t('feedbackForm.answer.not_sold')}
                      </label>
                    </FormItem>
                  </fieldset>
                  <FormMessage />
                </FormItem>
              )}
            />
            {form.watch('answer') === 'not_sold' && (
              <FormField
                control={form.control}
                name='description'
                render={({ field }) => (
                  <FormItem>
                    <label
                      className='text-sm font-medium'
                      htmlFor='description'
                    >
                      {t('feedbackForm.description.label')}
                    </label>
                    <FormControl>
                      <Textarea
                        id='description'
                        placeholder={t('feedbackForm.description.placeholder')}
                        className='!mt-5 h-[97px] w-full resize-none rounded-[12px] border border-gray-200 p-[16px] text-xs font-normal leading-4 placeholder:text-xs placeholder:text-gray-500 data-[state=focus]:border-primary-900'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <button
              type='submit'
              disabled={isSubmitDisabled}
              className='flex w-full justify-center rounded-[60px] bg-primary-900 px-5 py-[13px] leading-4 text-gray-50 disabled:cursor-not-allowed disabled:bg-gray-400 disabled:text-gray-50'
            >
              {form.formState.isSubmitting ? (
                <LoaderCircle className='size-4 animate-spin self-center' />
              ) : (
                t('buttons.submit')
              )}
            </button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
