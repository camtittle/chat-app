import z from 'zod'

export const postChatGroupSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1, 'Name is required'),
})

export type PostExampleRequestModel = z.infer<typeof postChatGroupSchema>