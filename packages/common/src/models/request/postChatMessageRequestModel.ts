import z from 'zod'

export const postChatMessageBodySchema = z.object({
  id: z.string().uuid(),
  content: z.string().min(1, 'Content is required'),
})

export const postChatMessageParamsSchema = z.object({
  chatGroupId: z.string().uuid(),
})

export type PostChatMessageRequestModel = z.infer<typeof postChatMessageBodySchema>