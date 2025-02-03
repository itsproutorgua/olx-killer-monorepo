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

    user_name: z.string().min(1, { message: t('errors.input.required') }),

    location: z.string().min(1, { message: t('errors.input.required') }),

    user_phone: z.string().min(1, { message: t('errors.input.required') }),

    user_email: z
      .string()
      .min(1, { message: t('errors.input.required') })
      .email({ message: t('errors.input.email') }),
  })
}
