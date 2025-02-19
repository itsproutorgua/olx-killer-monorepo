import { useEffect, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { LoaderCircle } from 'lucide-react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { z } from 'zod'

import { useProfileSchema } from '@/features/account/profile'
import { ProfileData } from '@/features/account/profile/ui/profile-data.tsx'
import { useLocations } from '@/entities/locations'
import { useUpdateProfile, useUserProfile } from '@/entities/user' // Import the useUpdateProfile hook
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shared/ui/shadcn-ui/form.tsx'
import { Input } from '@/shared/ui/shadcn-ui/input.tsx'
import { PageLoader, PenIcon } from '@/shared/ui'
import { useDebounce } from '@/shared/library/hooks'

export function ProfileEditForm() {
  const { t } = useTranslation()
  const { data: user, isSuccess: profileLoaded } = useUserProfile()
  const { mutate, isPending } = useUpdateProfile()
  const [searchTerm, setSearchTerm] = useState('')
  const [isLocationFocused, setIsLocationFocused] = useState(false)
  const [isSelectingLocation, setIsSelectingLocation] = useState(false)
  const debouncedSearchTerm = useDebounce(
    searchTerm.toLowerCase().split(', ')[0],
    200,
  )
  const { locations, cursor } = useLocations(debouncedSearchTerm, {})
  const ProfileFormSchema = useProfileSchema()
  const form = useForm<z.infer<typeof ProfileFormSchema>>({
    resolver: zodResolver(ProfileFormSchema),
    mode: 'onChange',
    defaultValues: {
      image: undefined,
      user_name: '',
      location_id: '',
      user_phone: '',
      user_email: '',
    },
  })

  useEffect(() => {
    if (profileLoaded && user) {
      if (user?.location?.id) {
        setSearchTerm(user?.location.name + ', ' + user?.location.region || '')
      }
      form.reset({
        image: undefined,
        user_name: user?.username || '',
        location_id: user?.location.name + ', ' + user?.location.region || '',
        user_phone: user?.phone_numbers[0] || '',
        user_email: user?.email || '',
      })
      form.setValue(
        'location_id',
        user?.location?.id ? user?.location.id.toString() : '',
      )
      form.trigger(['location_id', 'user_phone'])
    }
  }, [profileLoaded, user])

  const onSubmit = async (data: z.infer<typeof ProfileFormSchema>) => {
    const formData = new FormData()

    formData.append('username', data.user_name)
    formData.append('location_id', data.location_id)

    formData.append('phone_numbers', data.user_phone)

    if (data.image) {
      formData.append('picture', data.image)
    }

    try {
      mutate(formData, {
        onSuccess: () => {
          toast.success(t('profileForm.messages.profileUpdateSuccess'), {
            duration: 4000,
          })
        },
        onError: () => {
          toast.error(t('profileForm.messages.profileUpdateError'), {
            duration: 4000,
          })
        },
      })
    } catch (error) {
      console.error('Error updating profile', error)
    }
  }

  return (
    <>
      {!user ? (
        <PageLoader />
      ) : (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit, errors => {
              console.log('Validation errors:', errors)
            })}
            className='space-y-10 xl:space-y-[54px]'
          >
            <FormField
              control={form.control}
              name='image'
              render={() => (
                <FormItem>
                  <FormControl>
                    <ProfileData user={user} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div>
              <div className='space-y-6 xl:flex xl:max-w-[422px] xl:flex-col xl:gap-y-[30px] xl:space-y-0'>
                {/* Username input */}
                <FormField
                  control={form.control}
                  name='user_name'
                  render={({ field }) => (
                    <FormItem className='form-item'>
                      <FormLabel className='form-label'>
                        {t('profileForm.fields.userName.label')}*
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder={
                            user?.username ||
                            t('profileForm.fields.userName.placeholder')
                          }
                          {...field}
                          className='form-input'
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='location_id'
                  render={({ field }) => (
                    <FormItem className='form-item relative col-start-2 row-start-1'>
                      <FormLabel className='form-label' htmlFor='location'>
                        {t('profileForm.fields.city.label')}*
                      </FormLabel>
                      <FormControl>
                        <Input
                          id='location'
                          placeholder={t('profileForm.fields.city.placeholder')}
                          className='form-input relative'
                          value={searchTerm}
                          onChange={e => {
                            setSearchTerm(e.target.value)
                            setIsLocationFocused(true)
                            setIsSelectingLocation(false)
                          }}
                          onBlur={async () => {
                            if (isSelectingLocation) return

                            // Use a small timeout to allow state updates to propagate
                            setTimeout(() => {
                              const selectedLocation = locations?.find(loc => {
                                const [inputName] = searchTerm
                                  .toLowerCase()
                                  .split(', ')
                                return (
                                  loc.name.toLowerCase().trim() ===
                                  inputName?.trim()
                                )
                              })

                              if (!selectedLocation) {
                                setSearchTerm('')
                                field.onChange('')
                                form.setError('location_id', {
                                  message: t('errors.input.location'),
                                })
                              } else {
                                setSearchTerm(
                                  `${selectedLocation.name}, ${selectedLocation.region}`,
                                )
                                field.onChange(selectedLocation.id.toString())
                                form.clearErrors('location_id')
                              }
                              setIsLocationFocused(false)
                            }, 100)
                          }}
                          onFocus={() => setIsLocationFocused(true)}
                        />
                      </FormControl>
                      {isLocationFocused && debouncedSearchTerm.length >= 3 && (
                        <div className='absolute left-0 right-0 top-full z-50 mt-2 max-h-60 overflow-auto rounded-xl bg-white p-2 shadow-lg'>
                          {cursor}
                          {locations?.map(location => (
                            <div
                              key={location.id}
                              className='cursor-pointer p-2 hover:bg-gray-100'
                              onMouseDown={e => {
                                e.preventDefault()
                                setSearchTerm(
                                  location.name + ', ' + location.region,
                                )
                                field.onChange(location.id.toString()) // Assign valid location ID
                                setIsLocationFocused(false)
                                setIsSelectingLocation(true)
                                form.clearErrors('location_id')
                              }}
                            >
                              {location.name}, {location.region}
                            </div>
                          ))}
                          {locations?.length === 0 && (
                            <div className='p-2 text-gray-500'>
                              {t('profileForm.fields.city.noResults')}
                            </div>
                          )}
                        </div>
                      )}
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
                        {t('profileForm.fields.userPhone.label')}*
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t(
                            'profileForm.fields.userPhone.placeholder',
                          )}
                          className='form-input'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Email display */}
                <div className='form-item col-start-1 row-start-2'>
                  <label className='form-label' htmlFor='email'>
                    {t('listingForm.fields.userEmail.label')}*
                  </label>
                  <Input
                    id='email'
                    autoComplete='email'
                    disabled
                    value={
                      user?.email || t('listingForm.fields.userEmail.label')
                    }
                    readOnly
                    className='form-input bg-gray-50'
                  />
                </div>
              </div>
            </div>
            <button
              disabled={isPending}
              type='submit'
              className={`relative mx-auto flex h-[53px] w-[230px] items-center gap-6 rounded-[60px] bg-primary-900 py-[5px] pr-[5px] text-base/4 text-gray-50 transition-colors duration-300 hover:bg-primary-500 active:bg-primary-600 active:duration-0 disabled:cursor-not-allowed disabled:bg-gray-300 md:mx-0`}
            >
              {isPending ? (
                <p className='mx-auto'>
                  <LoaderCircle className='size-6 animate-spin' />
                </p>
              ) : (
                <span className='mr-16 flex flex-1 items-center pl-[37px]'>
                  <span className='flex w-full items-center justify-center'>
                    {t('profileForm.buttons.submit')}
                  </span>
                  <span className='absolute right-[5px] flex size-[43px] items-center justify-center rounded-full bg-gray-50 text-foreground'>
                    <PenIcon />
                  </span>
                </span>
              )}
            </button>
          </form>
        </Form>
      )}
    </>
  )
}
