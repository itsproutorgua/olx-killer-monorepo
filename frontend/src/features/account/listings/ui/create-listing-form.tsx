'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Pencil } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { z } from 'zod'

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
import { cn } from '@/shared/library/utils'
import { DndGrid } from './dnd-grid'

const minTextareaLength = 40
const maxTextareaLength = 15000

export function CreateListingForm() {
  const { t } = useTranslation()
  // const [files, setFiles] = useState<File[]>([])

  const FormSchema = z.object({
    name: z.string().min(1, { message: t('errors.input.required') }),
    category: z.string().min(1, { message: t('errors.input.required') }),
    images: z.array(z.instanceof(File)),
    description: z
      .string()
      .min(1, { message: t('errors.input.required') })
      .min(40, {
        message: t('errors.input.minLength', { minLength: minTextareaLength }),
      })
      .max(15000, {
        message: t('errors.input.maxLength', { maxLength: maxTextareaLength }),
      }),
    city: z.string().min(1, { message: t('errors.input.required') }),
    region: z.string().min(1, { message: t('errors.input.required') }),
    user_name: z.string().min(1, { message: t('errors.input.required') }),
    user_email: z
      .string()
      .min(1, { message: t('errors.input.required') })
      .email({ message: t('errors.input.email') }),
    user_phone: z.string().min(1, { message: t('errors.input.required') }),
  })
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: '',
      category: '',
      images: [],
      description: '',
      city: '',
      region: '',
      user_name: '',
      user_email: '',
      user_phone: '',
    },
  })

  // const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   if (event.target.files) {
  //     setFiles(Array.from(event.target.files))
  //     form.setValue('images', Array.from(event.target.files))
  //   }
  // }

  function onSubmit(data: z.infer<typeof FormSchema>) {
    console.log(data)
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
                        {t('listingForm.fields.name.label')}
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
                        {t('listingForm.fields.category.label')}
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

              {/* Images input */}
              <div className='space-y-5'>
                <div className='space-y-2.5'>
                  <p className='form-label'>
                    {t('listingForm.fields.images.label')}
                  </p>
                  <p className='form-desc'>
                    {t('listingForm.fields.images.desc')}
                  </p>
                </div>

                <DndGrid />
              </div>

              {/* Description input */}
              <FormField
                control={form.control}
                name='description'
                render={({ field }) => (
                  <FormItem className='form-item'>
                    <FormLabel className='form-label'>
                      {t('listingForm.fields.desc.label')}
                    </FormLabel>
                    <FormDescription
                      className={cn(
                        'form-description',
                        'flex justify-between pb-[14px]',
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
                        className='form-textarea'
                        {...field}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className='space-y-6 xl:grid xl:grid-cols-2 xl:gap-10 xl:space-y-0'>
                {/* City input */}
                <FormField
                  control={form.control}
                  name='city'
                  render={({ field }) => (
                    <FormItem className='form-item'>
                      <FormLabel className='form-label'>
                        {t('listingForm.fields.city.label')}
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
                    <FormItem className='form-item'>
                      <FormLabel className='form-label'>
                        {t('listingForm.fields.region.label')}
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t(
                            'listingForm.fields.region.placeholder',
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
            </div>
          </div>

          {/* Contacts info */}
          <div className='space-y-10 xl:space-y-8'>
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

            <div className='space-y-6 xl:w-[423px] xl:space-y-8'>
              {/* User name input */}
              <FormField
                control={form.control}
                name='user_name'
                render={({ field }) => (
                  <FormItem className='form-item'>
                    <FormLabel className='form-label'>
                      {t('listingForm.fields.userName.label')}
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
                  <FormItem className='form-item'>
                    <FormLabel className='form-label'>
                      {t('listingForm.fields.userEmail.label')}
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
                  <FormItem className='form-item'>
                    <FormLabel className='form-label'>
                      {t('listingForm.fields.userPhone.label')}
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
            </div>
          </div>
        </div>

        <button className='relative mx-auto flex h-[53px] min-w-[315px] items-center rounded-[60px] bg-primary-900 pl-[37px] text-base/none text-gray-50 transition-colors duration-300 hover:bg-primary-500 active:bg-primary-600 active:duration-0 xl:mx-0 xl:mr-auto'>
          <span>{t('listingForm.buttons.submit')}</span>
          <span className='absolute right-[5px] top-1/2 flex size-[43px] -translate-y-1/2 transform items-center justify-center rounded-full bg-gray-50 text-foreground'>
            <Pencil className='size-5' />
          </span>
        </button>
      </form>
    </Form>
  )
}
