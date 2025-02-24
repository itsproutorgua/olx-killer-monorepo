import { z } from 'zod'

export const useFeedbackSchema = () => {
  return z.object({
    answer: z.enum(['sold', 'sold_elsewhere', 'not_sold']),
    description: z.string().optional(),
  })
}

export type FeedbackFormData = z.infer<ReturnType<typeof useFeedbackSchema>>
