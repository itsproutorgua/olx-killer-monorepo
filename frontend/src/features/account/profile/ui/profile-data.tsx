import React, { useState } from 'react'
import { User } from 'auth0'
import { useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { EditAvatarIcon } from '@/shared/ui/icons'

interface Props {
  className?: string
  user?: User
}

export const ProfileData: React.FC<Props> = ({ className, user }) => {
  const { t } = useTranslation()
  const { setValue } = useFormContext()
  const [previewImage, setPreviewImage] = useState<string | null>(null)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setPreviewImage(URL.createObjectURL(file))
      setValue('image', file)
    }
  }
  return (
    <div className={className}>
      <div className='flex max-w-[422px] gap-[18px] rounded-[20px] bg-white py-8 pl-8 shadow-sm xl:items-center xl:gap-8 xl:bg-transparent xl:py-0 xl:pl-0 xl:shadow-none'>
        <div className='relative'>
          <img
            src={previewImage || user?.picture}
            alt='Profile'
            className='h-[70px] w-[70px] rounded-full object-cover xl:h-[100px] xl:w-[100px]'
          />
          <label
            className='absolute bottom-6 right-1 h-5 w-5 cursor-pointer transition duration-300 hover:text-primary-500 xl:bottom-2 xl:right-2'
            aria-label={t('Edit profile')}
          >
            <EditAvatarIcon />
            <input
              type='file'
              accept='image/*'
              onChange={e => handleFileChange(e)}
              className='hidden'
            />
          </label>
        </div>
        <div className='flex flex-1 flex-col gap-1 text-gray-500 xl:gap-2'>
          <h2 className='mb-[6px] font-medium leading-5 text-gray-900 xl:text-xl'>
            {user?.name}
          </h2>
          <p className='text-sm font-light leading-[18px] xl:font-normal'>
            {user?.phone_number || t('profileForm.fields.city.noCity')}
          </p>
          <p className='text-sm font-light leading-[18px] xl:font-normal'>
            {user?.phone_number || t('profileForm.fields.userPhone.noPhone')}
          </p>
          <p className='text-sm font-light leading-[18px]'>{user?.email}</p>
        </div>
      </div>
    </div>
  )
}
