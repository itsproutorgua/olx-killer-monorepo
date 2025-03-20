import { useTranslation } from 'react-i18next'
import { z } from 'zod'

const MAX_IMAGE_SIZE = 10 * 1024 * 1024 // 10MB
const MAX_VIDEO_SIZE = 100 * 1024 * 1024 // 100MB
const MAX_IMAGES_COUNT = 8
const VIDEO_MAX_DURATION = 60 // seconds

export const useFormSchema = () => {
  const { t } = useTranslation()

  return z.object({
    title: z
      .string()
      .min(3, { message: t('errors.input.minLength', { minLength: 3 }) })
      .max(150, { message: t('errors.input.maxLength', { maxLength: 150 }) })
      .regex(
        /^\s?[a-zA-Zа-яА-ЯґҐєЄіІїЇ0-9]+(?:[-\sʼ'][a-zA-Zа-яА-ЯґҐєЄіІїЇ0-9]+)*\s?$/,
        {
          message: t('errors.input.invalidCharacters'),
        },
      ),

    amount: z
      .string()
      .min(1, { message: t('errors.input.required') })
      .refine(val => !isNaN(parseFloat(val)), {
        message: t('errors.input.number'),
      })
      .refine(val => /^\d+(\.\d{1,2})?$/.test(val), {
        message: t('errors.input.decimalPlaces'), // Ensures up to two decimal places
      })
      .refine(val => parseFloat(val) > 0, {
        message: t('errors.input.positiveOnly'), // Ensures only positive values
      })
      .refine(val => parseFloat(val) <= 1000000000, {
        message: t('errors.input.max', { max: '1,000,000,000' }),
      }),
    currency: z.coerce.number().min(1, { message: t('errors.input.required') }),

    description: z
      .string()
      .min(10, { message: t('errors.input.minLength', { minLength: 10 }) })
      .max(10000, {
        message: t('errors.input.maxLength', { maxLength: 10000 }),
      })
      .refine(value => value.trim().length >= 10, {
        message: t('errors.input.minLength', { minLength: 10 }),
      }),

    category_id: z.coerce
      .number()
      .min(1, { message: t('errors.input.required') }),

    uploaded_images: z
      .array(
        z
          .instanceof(File)
          .refine(file => ['image/jpeg', 'image/png'].includes(file.type), {
            message: t('errors.input.invalidImageFormat'),
          })
          .refine(file => file.size <= MAX_IMAGE_SIZE, {
            message: t('errors.input.imageSizeExceeded', { maxSize: '10MB' }),
          }),
      )
      .max(MAX_IMAGES_COUNT, {
        message: t('errors.input.maxImages', { max: MAX_IMAGES_COUNT }),
      })
      .optional(),

    upload_video: z
      .instanceof(File)
      .optional()
      .refine(
        file =>
          !file ||
          ['video/mp4', 'video/webm', 'video/quicktime'].includes(file.type),
        {
          message: t('errors.input.invalidVideoFormat'),
        },
      )
      .refine(file => !file || file.size <= MAX_VIDEO_SIZE, {
        message: t('errors.input.videoSizeExceeded', { maxSize: '100MB' }),
      })
      .refine(
        async file => {
          if (!file) return true
          const video = document.createElement('video')
          video.src = URL.createObjectURL(file)
          await new Promise(resolve => (video.onloadedmetadata = resolve))
          return video.duration <= VIDEO_MAX_DURATION
        },
        { message: t('errors.input.videoDurationExceeded', { max: 60 }) },
      ),
    status: z.enum(['new', 'used'], {
      required_error: t('errors.input.required'),
    }),
    location: z.string().min(1, {
      message: t('errors.input.required') + ', ' + t('errors.input.update'),
    }),

    user_name: z.string().min(1, {
      message: t('errors.input.required') + ', ' + t('errors.input.update'),
    }),

    user_email: z
      .string()
      .min(1, {
        message: t('errors.input.required') + ', ' + t('errors.input.update'),
      })
      .email({ message: t('errors.input.email') }),

    user_phone: z.string().min(1, {
      message: t('errors.input.required') + ', ' + t('errors.input.update'),
    }),
  })
}
