import { useTranslation } from 'react-i18next'
import { z } from 'zod'

const MAX_IMAGE_SIZE = 1024 * 1024 // 1MB
const MAX_VIDEO_SIZE = 10 * 1024 * 1024 // 10MB
const MAX_IMAGES_COUNT = 8
const VIDEO_MAX_DURATION = 15 // seconds

export const useFormSchema = () => {
  const { t } = useTranslation()

  return z.object({
    name: z
      .string()
      .min(3, { message: t('errors.input.minLength', { minLength: 3 }) })
      .max(100, { message: t('errors.input.maxLength', { maxLength: 100 }) })
      .regex(/^[a-zA-Z0-9\s-]+$/, {
        message: t('errors.input.invalidCharacters'),
      }),

    category: z.string().min(1, { message: t('errors.input.required') }),

    price: z
      .number({
        required_error: t('errors.input.required'),
        invalid_type_error: t('errors.input.invalidNumber'),
      })
      .positive({ message: t('errors.input.positiveNumber') })
      .max(1_000_000, {
        message: t('errors.input.maxValue', { max: 1_000_000 }),
      })
      .multipleOf(0.01, { message: t('errors.input.decimalPlaces') }),

    description: z
      .string()
      .min(10, { message: t('errors.input.minLength', { minLength: 10 }) })
      .max(1000, { message: t('errors.input.maxLength', { maxLength: 1000 }) }),

    images: z
      .array(
        z
          .instanceof(File)
          .refine(file => ['image/jpeg', 'image/png'].includes(file.type), {
            message: t('errors.input.invalidImageFormat'),
          })
          .refine(file => file.size <= MAX_IMAGE_SIZE, {
            message: t('errors.input.imageSizeExceeded', { maxSize: '1MB' }),
          }),
      )
      .max(MAX_IMAGES_COUNT, {
        message: t('errors.input.maxImages', { max: MAX_IMAGES_COUNT }),
      })
      .optional(),

    video: z
      .instanceof(File)
      .optional()
      .refine(
        file => !file || ['video/mp4', 'video/webm'].includes(file.type),
        {
          message: t('errors.input.invalidVideoFormat'),
        },
      )
      .refine(file => !file || file.size <= MAX_VIDEO_SIZE, {
        message: t('errors.input.videoSizeExceeded', { maxSize: '10MB' }),
      })
      .refine(
        async file => {
          if (!file) return true
          const video = document.createElement('video')
          video.src = URL.createObjectURL(file)
          await new Promise(resolve => (video.onloadedmetadata = resolve))
          return video.duration <= VIDEO_MAX_DURATION
        },
        { message: t('errors.input.videoDurationExceeded', { max: 15 }) },
      ),

    location: z.string().min(1, { message: t('errors.input.required') }),

    user_name: z.string().min(1, { message: t('errors.input.required') }),

    user_email: z
      .string()
      .min(1, { message: t('errors.input.required') })
      .email({ message: t('errors.input.email') }),

    user_phone: z.string().min(1, { message: t('errors.input.required') }),
  })
}
