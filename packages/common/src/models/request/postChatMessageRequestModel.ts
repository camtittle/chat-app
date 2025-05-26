import z from 'zod'

export const postChatMessageSchema = z.object({
  id: z.string().uuid(),
  content: z.string().min(1, 'Content is required'),
  chatGroupId: z.string().uuid(),
  // this would normally come from an auth header, sending in req body for MVP
  userId: z.string().uuid(), 
})

export type PostChatMessageRequestModel = z.infer<typeof postChatMessageSchema>