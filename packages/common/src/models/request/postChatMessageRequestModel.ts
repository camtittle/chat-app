import z from 'zod'

export const postChatMessageBodySchema = z.object({
  id: z.string().uuid(),
  content: z.string().min(1, 'Content is required'),
  // this would normally come from an auth header, sending in req body for MVP
  userId: z.string().uuid(), 
})

export const postChatMessageParamsSchema = z.object({
  chatGroupId: z.string().uuid(),
})

export type PostChatMessageRequestModel = z.infer<typeof postChatMessageBodySchema>