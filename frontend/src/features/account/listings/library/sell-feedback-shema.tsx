import { useTranslation } from 'react-i18next'
import { z } from 'zod'

export const useFeedbackSchema = () => {
  const { t } = useTranslation()

  return z.object({
    answer: z.enum(['sold', 'sold_elsewhere', 'not_sold']),
    description: z
      .string()
      .min(10, { message: t('errors.input.minLength', { minLength: 10 }) })
      .max(1000, { message: t('errors.input.maxLength', { maxLength: 1000 }) })
      .optional(),
  })
}

export type FeedbackFormData = z.infer<ReturnType<typeof useFeedbackSchema>>
