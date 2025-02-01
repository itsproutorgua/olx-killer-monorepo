import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import i18n from 'i18next'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { z } from 'zod'

import { useFormSchema } from '@/features/account/listings'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shared/ui/shadcn-ui/form'
import { Input } from '@/shared/ui/shadcn-ui/input'
import { Textarea } from '@/shared/ui/shadcn-ui/textarea'
import { PenIcon } from '@/shared/ui'
import { XCircleSmall } from '@/shared/ui/icons'
import { VideoUploadIcon } from '@/shared/ui/icons/video-upload-icon.tsx'
import { cn } from '@/shared/library/utils'
import { DndGrid } from './dnd-grid'

const minTextareaLength = 10
const maxTextareaLength = 15000

export function CreateListingForm() {
  const { t } = useTranslation()
  const [selectedVideoFile, setSelectedVideoFile] = useState<File | null>(null)
  const handleCancelVideo = () => {
    setSelectedVideoFile(null)
    form.setValue('video', undefined)
  }

  const FormSchema = useFormSchema()
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: '',
      category: '',
      price: undefined,
      description: '',
      images: undefined,
      video: undefined,
      city: '',
      region: '',
      user_name: '',
      user_email: '',
      user_phone: '',
    },
  })

  function onSubmit(data: z.infer<typeof FormSchema>) {
    console.log(data.images)
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className='space-y-[50px] xl:w-[885px]'
      >
        <div className='space-y-[60px]'>
          {/* 1 Info about product */}
          <div className='space-y-10'>
            <div className='flex items-start gap-4 xl:gap-6'>
              <div className='flex size-8 flex-none items-center justify-center rounded-full border border-dashed border-primary-400 text-base/none font-semibold text-primary-700'>
                1
              </div>
              <div className='space-y-2'>
                <h2 className='text-lg/[21.78px] font-medium xl:text-2xl/[29.05px]'>
                  {t('listingForm.listingInfo.title')}
                </h2>
                <p className='text-xs/[16.8px] text-gray-600 xl:text-sm/[19.6px]'>
                  {t('listingForm.listingInfo.desc')}
                </p>
              </div>
            </div>

            <div className='space-y-6 xl:space-y-[50px]'>
              <div className='space-y-6 xl:grid xl:grid-cols-2 xl:gap-10 xl:space-y-0'>
                {/* Name input */}
                <FormField
                  control={form.control}
                  name='name'
                  render={({ field }) => (
                    <FormItem className='form-item'>
                      <FormLabel className='form-label'>
                        {t('listingForm.fields.name.label')}*
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t('listingForm.fields.name.placeholder')}
                          {...field}
                          className='form-input'
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Category input */}
                <FormField
                  control={form.control}
                  name='category'
                  render={({ field }) => (
                    <FormItem className='form-item'>
                      <FormLabel className='form-label'>
                        {t('listingForm.fields.category.label')}*
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t(
                            'listingForm.fields.category.placeholder',
                          )}
                          className='form-input'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className='space-y-6 xl:grid xl:grid-cols-2 xl:gap-10 xl:space-y-0'>
                {/* Price input */}
                <FormField
                  control={form.control}
                  name='price'
                  render={({ field }) => (
                    <FormItem className='form-item'>
                      <FormLabel className='form-label'>
                        {t('listingForm.fields.price.label')}*
                      </FormLabel>
                      <FormControl>
                        <Input
                          type='number'
                          placeholder={t(
                            'listingForm.fields.price.placeholder',
                          )}
                          value={field.value ?? ''}
                          onChange={e => {
                            const value = e.target.value
                            const numericValue =
                              value === '' ? undefined : parseFloat(value)
                            field.onChange(numericValue)
                          }}
                          className='form-input'
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Images and video inputs */}
              <div className='space-y-5 pt-4 xl:pt-0'>
                <div className='space-y-2.5'>
                  <p className='form-label'>
                    {t('listingForm.fields.images.label')}
                  </p>
                  <p className='form-desc'>
                    {t('listingForm.fields.images.desc')}
                  </p>
                </div>

                <FormField
                  control={form.control}
                  name='images'
                  render={() => (
                    <FormItem>
                      <FormControl>
                        <DndGrid />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='video'
                  render={({ field }) => (
                    <FormItem className='form-item'>
                      <FormControl>
                        <div>
                          <label htmlFor='video-upload'>
                            <span className='cursor-pointer text-sm leading-none text-[#737373]'>
                              {selectedVideoFile ? (
                                <span className='flex items-center gap-2 text-primary-500'>
                                  {selectedVideoFile.name}{' '}
                                  <span
                                    className='cursor-pointer'
                                    onClick={e => {
                                      e.preventDefault()
                                      handleCancelVideo()
                                    }}
                                  >
                                    <XCircleSmall className='text-primary-700' />
                                  </span>
                                </span>
                              ) : (
                                <span className='flex items-center gap-[10px]'>
                                  <VideoUploadIcon />{' '}
                                  {t('listingForm.fields.video.uploadButton')}
                                </span>
                              )}
                            </span>
                            <Input
                              id='video-upload'
                              type='file'
                              accept='video/*'
                              className='hidden'
                              onChange={e => {
                                if (
                                  e.target.files &&
                                  e.target.files.length > 0
                                ) {
                                  const file = e.target.files[0]
                                  setSelectedVideoFile(file)
                                  field.onChange(file)
                                }
                              }}
                            />
                          </label>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Description input */}
              <FormField
                control={form.control}
                name='description'
                render={({ field }) => (
                  <FormItem className='form-item space-y-[10px] pt-4 xl:pt-0'>
                    <FormLabel className='form-label'>
                      {t('listingForm.fields.desc.label')}*
                    </FormLabel>
                    <FormDescription
                      className={cn(
                        'form-description',
                        'flex justify-between pb-[10px] text-gray-600',
                      )}
                    >
                      {t('listingForm.fields.desc.desc')}
                      <span>
                        {form.getValues('description').length}/
                        {maxTextareaLength}
                      </span>
                    </FormDescription>
                    <FormControl>
                      <Textarea
                        maxLength={maxTextareaLength}
                        minLength={minTextareaLength}
                        placeholder={t('listingForm.fields.desc.placeholder')}
                        className='form-textarea max-w-[518px] text-gray-500'
                        {...field}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Contacts info */}
          <div className='space-y-[30px]'>
            <div className='flex items-center gap-4'>
              <div className='flex size-8 flex-none items-center justify-center rounded-full border border-dashed border-primary-400 text-base/none font-semibold text-primary-700'>
                2
              </div>
              <div className='space-y-2'>
                <h2 className='text-lg/[21.78px] font-medium xl:text-2xl/[29.05px]'>
                  {t('listingForm.contactInfo.title')}
                </h2>
              </div>
            </div>

            <div className='space-y-6 xl:grid xl:grid-cols-2 xl:gap-x-10 xl:gap-y-[30px] xl:space-y-0'>
              {/* Username input */}
              <FormField
                control={form.control}
                name='user_name'
                render={({ field }) => (
                  <FormItem className='form-item'>
                    <FormLabel className='form-label'>
                      {t('listingForm.fields.userName.label')}*
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t(
                          'listingForm.fields.userName.placeholder',
                        )}
                        {...field}
                        className='form-input'
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* User email input */}
              <FormField
                control={form.control}
                name='user_email'
                render={({ field }) => (
                  <FormItem className='form-item col-start-1 row-start-2'>
                    <FormLabel className='form-label'>
                      {t('listingForm.fields.userEmail.label')}*
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t(
                          'listingForm.fields.userEmail.placeholder',
                        )}
                        className='form-input'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* User phone input */}
              <FormField
                control={form.control}
                name='user_phone'
                render={({ field }) => (
                  <FormItem className='form-item col-start-1 row-start-3'>
                    <FormLabel className='form-label'>
                      {t('listingForm.fields.userPhone.label')}*
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t(
                          'listingForm.fields.userPhone.placeholder',
                        )}
                        className='form-input'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* City input */}
              <FormField
                control={form.control}
                name='city'
                render={({ field }) => (
                  <FormItem className='form-item col-start-2 row-start-1'>
                    <FormLabel className='form-label'>
                      {t('listingForm.fields.city.label')}*
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t('listingForm.fields.city.placeholder')}
                        className='form-input'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Region input */}
              <FormField
                control={form.control}
                name='region'
                render={({ field }) => (
                  <FormItem className='form-item col-start-2 row-start-2'>
                    <FormLabel className='form-label'>
                      {t('listingForm.fields.region.label')}*
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t('listingForm.fields.region.placeholder')}
                        className='form-input'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>

        <button
          type='submit'
          className={`relative flex h-[53px] min-w-[315px] items-center gap-6 rounded-[60px] bg-primary-900 py-[5px] pr-[5px] text-base/4 text-gray-50 transition-colors duration-300 hover:bg-primary-500 active:bg-primary-600 active:duration-0 ${i18n.language !== 'uk' ? 'pl-[37px]' : 'xl:pl-[20px]'}`}
        >
          <span className='mr-7 flex flex-1 items-center justify-center xl:mr-12'>
            {t('listingForm.buttons.submit')}
          </span>
          <span className='absolute right-[5px] flex size-[43px] items-center justify-center rounded-full bg-gray-50 text-foreground'>
            <PenIcon />
          </span>
        </button>
      </form>
    </Form>
  )
}
