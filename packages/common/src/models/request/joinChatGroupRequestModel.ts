import z from 'zod'

export const joinChatGroupRequestSchema = z.object({
  chatGroupId: z.string().uuid(),
  // this would normally come from an auth header, sending in req body for MVP
  userId: z.string().uuid(),
})

export type JoinChatGroupRequestModel = z.infer<typeof joinChatGroupRequestSchema>