import { useTranslation } from 'react-i18next'
import { z } from 'zod'

const MAX_IMAGE_SIZE = 1024 * 1024 // 1MB

export const useProfileSchema = () => {
  const { t } = useTranslation()

  return z.object({
    image: z
      .instanceof(File)
      .refine(
        file => !file || ['image/jpeg', 'image/png'].includes(file.type),
        { message: t('errors.input.invalidImageFormat') },
      )
      .refine(file => file.size <= MAX_IMAGE_SIZE, {
        message: t('errors.input.imageSizeExceeded', { maxSize: '1MB' }),
      })
      .optional(),

    user_name: z
      .string()
      .min(3, { message: t('errors.input.minLength', { minLength: 3 }) })
      .max(20, { message: t('errors.input.maxLength', { maxLength: 20 }) })
      .regex(/^[a-zA-Zа-яА-ЯґҐєЄіІїЇ0-9\s-]+$/, {
        message: t('errors.input.invalidCharacters'),
      }),

    location_id: z
      .string()
      .min(1, { message: t('errors.input.locationNeeded') }),

    user_phone: z
      .string()
      .min(1, { message: t('errors.input.phone.needed') })
      .min(10, { message: t('errors.input.phone.tooShort', { minLength: 10 }) })
      .max(15, { message: t('errors.input.phone.tooLong', { minLength: 15 }) })
      .regex(/^\+?\d{9,15}$/, { message: t('errors.input.phone.invalid') }),

    user_email: z
      .string()
      .min(1, { message: t('errors.input.required') })
      .email({ message: t('errors.input.email') })
      .optional(),
  })
}
