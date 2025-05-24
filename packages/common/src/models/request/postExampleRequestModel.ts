import z from 'zod'

export const postExampleRequestSchema = z.object({
  name: z.string().min(1, 'Name is required'),
})

export type PostExampleRequestModel = z.infer<typeof postExampleRequestSchema>