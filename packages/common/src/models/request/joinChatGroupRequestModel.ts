import z from 'zod'

export const joinChatGroupRequestSchema = z.object({
  chatGroupId: z.string().uuid(),
})

export type JoinChatGroupRequestModel = z.infer<typeof joinChatGroupRequestSchema>