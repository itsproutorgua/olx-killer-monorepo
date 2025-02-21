import { useEffect, useState } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import { zodResolver } from '@hookform/resolvers/zod'
import i18n from 'i18next'
import { LoaderCircle } from 'lucide-react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { z } from 'zod'

import {
  CategoryDialog,
  CurrencySelect,
  ProfileNotFilled,
  useFormSchema,
} from '@/features/account/listings'
import { useCreateProduct } from '@/entities/product/library/hooks/use-create-product.tsx'
import { useUserProfile } from '@/entities/user'
import { PenIcon, SpinnerIcon } from '@/shared/ui'
import {
  ArrowDownSmall,
  VideoUploadIcon,
  XCircleSmall,
} from '@/shared/ui/icons'
import {
  Checkbox,
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Textarea,
} from '@/shared/ui/shadcn-ui'
import { PRIVATE_PAGES } from '@/shared/constants'
import { cn } from '@/shared/library/utils'
import { DndGrid } from './dnd-grid'

const minTextareaLength = 10
const maxTextareaLength = 15000

export function CreateListingForm() {
  const { t } = useTranslation()
  const { user: userAuth } = useAuth0()
  const {
    data: userProfile,
    isLoading,
    isSuccess: profileLoaded,
  } = useUserProfile()
  const navigate = useNavigate()
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false)
  const [categoryTitle, setCategoryTitle] = useState('')
  const [selectedVideoFile, setSelectedVideoFile] = useState<File | null>(null)
  const handleCancelVideo = () => {
    setSelectedVideoFile(null)
    form.setValue('upload_video', undefined)
  }

  const FormSchema = useFormSchema()
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    mode: 'onChange',
    defaultValues: {
      title: '',
      category_id: 0,
      amount: '',
      currency: 1,
      description: '',
      uploaded_images: undefined,
      upload_video: undefined,
      status: 'new',
      user_name:
        userProfile?.username || t('listingForm.fields.userName.placeholder'),
      user_email: userProfile?.email || t('listingForm.fields.userEmail.label'),
      user_phone:
        userProfile?.phone_numbers[0] ||
        t('listingForm.fields.userPhone.placeholder'),
      location:
        userProfile?.location?.name || t('listingForm.fields.city.placeholder'),
    },
  })

  useEffect(() => {
    if (profileLoaded && userProfile) {
      form.reset({
        user_name: userProfile?.username || '',
        location: userProfile?.location.name || '',
        user_phone: userProfile?.phone_numbers[0] || '',
        user_email: userProfile?.email || '',
      })
    }
  }, [profileLoaded, userProfile])

  const { mutate: createProduct, isPending } = useCreateProduct()

  function onSubmit(data: z.infer<typeof FormSchema>) {
    const formData = new FormData()

    formData.append('title', data.title)
    formData.append('description', data.description)
    formData.append('category_id', String(data.category_id))
    formData.append('status', data.status)
    formData.append('amount', String(data.amount))
    formData.append('currency', String(data.currency))

    // Append images as files
    if (data.uploaded_images && data.uploaded_images.length > 0) {
      Array.from(data.uploaded_images).forEach(file => {
        formData.append('uploaded_images', file) // to send multiple images
      })
    }

    // Append video file (if exists)
    if (data.upload_video) {
      formData.append('upload_video', data.upload_video)
    }

    createProduct(formData, {
      onSuccess: () => {
        navigate(PRIVATE_PAGES.LISTING_SUCCESS, {
          state: { fromFormSubmission: true },
          replace: true,
        })
      },
      onError: () => {
        toast.error('Error during form submission!')
      },
    })
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className='space-y-[50px] xl:w-[885px]'
      >
        {userProfile &&
          (form.watch('user_phone') === '' ||
            form.watch('location') === '') && (
            <ProfileNotFilled className='-mt-[10px] min-h-[164px] max-w-[666px] xl:-mt-5' />
          )}
        <div className='space-y-[60px]'>
          {/* Info about product */}
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
                  name='title'
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
                  name='category_id'
                  render={({ field }) => (
                    <FormItem className='form-item'>
                      <FormLabel className='form-label' htmlFor='category'>
                        {t('listingForm.fields.category.label')}*
                      </FormLabel>
                      <FormControl>
                        <div className='relative'>
                          <Input
                            id='category'
                            placeholder={t(
                              'listingForm.fields.category.placeholder',
                            )}
                            className='form-input cursor-pointer'
                            readOnly
                            value={categoryTitle}
                            onClick={() => setIsCategoryDialogOpen(true)}
                          />
                          <ArrowDownSmall
                            className='absolute right-[15px] top-[10px]'
                            onClick={() => setIsCategoryDialogOpen(true)}
                          />
                          <CategoryDialog
                            open={isCategoryDialogOpen}
                            onOpenChange={setIsCategoryDialogOpen}
                            onSelect={(id: string, title: string) => {
                              field.onChange(id)
                              setCategoryTitle(title)
                            }}
                          />
                        </div>
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
                  name='amount'
                  render={({ field }) => (
                    <FormItem className='form-item'>
                      <FormLabel className='form-label' htmlFor='price'>
                        {t('listingForm.fields.price.label')}*
                      </FormLabel>
                      <FormControl>
                        <div className='relative flex'>
                          <Input
                            id='price'
                            placeholder={t(
                              'listingForm.fields.price.placeholder',
                            )}
                            className='form-input'
                            {...field}
                          />
                          <div className='absolute right-0 h-11 shadow-none'>
                            <FormField
                              control={form.control}
                              name='currency'
                              render={({ field: currencyField }) => (
                                <CurrencySelect
                                  value={currencyField.value.toString()}
                                  onValueChange={currencyField.onChange}
                                />
                              )}
                            />
                          </div>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/*Status Field*/}
              <FormField
                control={form.control}
                name='status'
                render={({ field }) => (
                  <FormItem className='space-y-3'>
                    <FormLabel className='form-label' htmlFor='status-label'>
                      {t('listingForm.fields.status.label')}*
                    </FormLabel>
                    <input hidden type='radio' id='status-label' />
                    <fieldset
                      aria-labelledby='status-label'
                      className='flex flex-col gap-[10px]'
                    >
                      <FormItem className='flex items-center space-x-3 space-y-0'>
                        <FormControl>
                          <Checkbox
                            id='status-new'
                            checked={field.value === 'new'}
                            onCheckedChange={checked =>
                              checked && field.onChange('new')
                            }
                            className='h-5 w-5 rounded-full'
                          />
                        </FormControl>
                        <label className='font-normal' htmlFor='status-new'>
                          {t('listingForm.fields.status.new')}
                        </label>
                      </FormItem>
                      <FormItem className='flex items-center space-x-3 space-y-0'>
                        <FormControl>
                          <Checkbox
                            id='status-used'
                            checked={field.value === 'used'}
                            onCheckedChange={checked =>
                              checked && field.onChange('used')
                            }
                            className='h-5 w-5 rounded-full'
                          />
                        </FormControl>
                        <label className='font-normal' htmlFor='status-used'>
                          {t('listingForm.fields.status.used')}
                        </label>
                      </FormItem>
                    </fieldset>
                    <FormMessage />
                  </FormItem>
                )}
              />

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
                  name='uploaded_images'
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
                  name='upload_video'
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
                  <FormItem className='form-item max-w-[518px] space-y-[10px] pt-4 xl:pt-0'>
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
                        className='form-textarea text-gray-900'
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

            {isLoading ? (
              <div className='flex justify-center xl:max-w-[422px] xl:justify-start xl:pl-32'>
                <SpinnerIcon className='h-12 w-12 animate-spin text-primary-900' />
              </div>
            ) : (
              <div className='flex flex-col gap-6 xl:max-w-[422px] xl:gap-[30px]'>
                <FormField
                  control={form.control}
                  name='user_name'
                  render={({ field }) => (
                    <FormItem className='form-item'>
                      <FormLabel className='form-label' htmlFor='username'>
                        {t('listingForm.fields.userName.label')}*
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          id='username'
                          readOnly
                          placeholder={t(
                            'listingForm.fields.userName.placeholder',
                          )}
                          className='form-input bg-gray-50'
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Email display */}
                <FormField
                  control={form.control}
                  name='user_email'
                  render={({ field }) => (
                    <FormItem className='form-item'>
                      <FormLabel className='form-label' htmlFor='email'>
                        {t('listingForm.fields.userEmail.label')}*
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          id='email'
                          readOnly
                          placeholder={t('listingForm.fields.userEmail.label')}
                          className='form-input bg-gray-50'
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Phone display */}
                <FormField
                  control={form.control}
                  name='user_phone'
                  render={({ field }) => (
                    <FormItem className='form-item'>
                      <FormLabel className='form-label' htmlFor='phone'>
                        {t('listingForm.fields.userPhone.label')}*
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          id='phone'
                          readOnly
                          placeholder={t(
                            'listingForm.fields.userPhone.placeholder',
                          )}
                          className='form-input bg-gray-50'
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Location display */}
                <FormField
                  control={form.control}
                  name='location'
                  render={({ field }) => (
                    <FormItem className='form-item'>
                      <FormLabel className='form-label' htmlFor='location'>
                        {t('listingForm.fields.city.label')}*
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          id='location'
                          readOnly
                          placeholder={t('listingForm.fields.city.placeholder')}
                          className='form-input bg-gray-50'
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}
          </div>
        </div>

        <button
          type='submit'
          className={`relative mx-auto flex h-[53px] min-w-[315px] items-center gap-6 rounded-[60px] bg-primary-900 py-[5px] pr-[5px] text-base/4 text-gray-50 transition-colors duration-300 hover:bg-primary-500 active:bg-primary-600 active:duration-0 disabled:cursor-not-allowed disabled:bg-gray-300 xl:mx-0 ${
            i18n.language !== 'uk' ? 'pl-[37px]' : 'xl:pl-[20px]'
          }`}
          disabled={isPending || !userAuth?.email_verified}
        >
          {isPending ? (
            <span
              className={`flex w-full items-center justify-center pr-0 xl:pr-5 ${
                i18n.language !== 'uk'
                  ? 'pr-[32px] xl:pr-[32px]'
                  : 'pl-[5px] xl:pl-0'
              }`}
            >
              <LoaderCircle className='size-6 animate-spin' />
            </span>
          ) : (
            <span className='mr-7 flex flex-1 items-center justify-center xl:mr-12'>
              {t('listingForm.buttons.submit')}
            </span>
          )}
          {!isPending && (
            <span className='absolute right-[5px] flex size-[43px] items-center justify-center rounded-full bg-gray-50 text-foreground'>
              <PenIcon />
            </span>
          )}
        </button>
      </form>
    </Form>
  )
}
