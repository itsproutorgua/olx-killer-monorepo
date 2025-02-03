import { useAuth0 } from '@auth0/auth0-react'
import { zodResolver } from '@hookform/resolvers/zod'
import i18n from 'i18next'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { z } from 'zod'

import { useProfileSchema } from '@/features/account/profile'
import { ProfileData } from '@/features/account/profile/ui/profile-data.tsx'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shared/ui/shadcn-ui/form.tsx'
import { Input } from '@/shared/ui/shadcn-ui/input.tsx'
import { PenIcon } from '@/shared/ui'

export function ProfileEditForm() {
  const { t } = useTranslation()
  const { user } = useAuth0()
  const ProfileFormSchema = useProfileSchema()
  const form = useForm<z.infer<typeof ProfileFormSchema>>({
    resolver: zodResolver(ProfileFormSchema),
    defaultValues: {
      image: undefined,
      user_name: user?.name || '',
      location: '',
      user_phone: user?.phone_number || '',
      user_email: user?.email || '',
    },
  })

  function onSubmit(data: z.infer<typeof ProfileFormSchema>) {
    console.log(data)
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
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
                      placeholder={t('profileForm.fields.userName.placeholder')}
                      {...field}
                      className='form-input'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* City input */}
            <FormField
              control={form.control}
              name='location'
              render={({ field }) => (
                <FormItem className='form-item col-start-2 row-start-1'>
                  <FormLabel className='form-label'>
                    {t('profileForm.fields.city.label')}*
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t('profileForm.fields.city.placeholder')}
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

            {/* User email input */}
            <FormField
              disabled
              control={form.control}
              name='user_email'
              render={({ field }) => (
                <FormItem className='form-item col-start-1 row-start-2'>
                  <FormLabel className='form-label'>
                    {t('profileForm.fields.userEmail.label')}*
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t(
                        'profileForm.fields.userEmail.placeholder',
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
        <button
          type='submit'
          className={`relative mx-auto flex h-[53px] w-[230px] items-center gap-6 rounded-[60px] bg-primary-900 py-[5px] pr-[5px] text-base/4 text-gray-50 transition-colors duration-300 hover:bg-primary-500 active:bg-primary-600 active:duration-0 md:mx-0 ${i18n.language !== 'uk' ? 'pl-[37px]' : 'xl:pl-[20px]'}`}
        >
          <span className='mr-7 flex flex-1 items-center justify-center xl:mr-12'>
            {t('profileForm.buttons.submit')}
          </span>
          <span className='absolute right-[5px] flex size-[43px] items-center justify-center rounded-full bg-gray-50 text-foreground'>
            <PenIcon />
          </span>
        </button>
      </form>
    </Form>
  )
}
