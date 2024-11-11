import * as z from 'zod'

export const ReviewValidation = z.object({
  accountId: z.string(),
  songTitle: z
    .string()
    .nonempty({ message: 'Song title is required' })
    .min(3, { message: 'Minimum 3 characters.' })
    .max(55, { message: 'Maximum 55 characters' }),
  artist: z
    .string()
    .nonempty({ message: 'Artist name is required' })
    .min(3, { message: 'Minimum 3 characters.' })
    .max(55, { message: 'Maximum 55 characters' }),
  review: z
    .string()
    .nonempty({ message: 'Review text is required' })
    .min(3, { message: 'Minimum 3 characters.' })
    .max(500, { message: 'Maximum 500 characters' }),
  dateListened: z.date().refine((val) => !!val, {
    message: 'Select a date',
  }),
  rating: z
    .number()
    .min(1, { message: 'Select a rating between 1 and 5.' })
    .max(5),
  listenedBefore: z.boolean().default(false),
  image: z.string().optional()
})

export const CommentValidation = z.object({
  review: z.string().nonempty().min(3, { message: 'Minimum 3 characters.' }),
})