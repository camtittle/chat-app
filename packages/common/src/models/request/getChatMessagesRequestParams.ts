import z from 'zod'

export const getChatMessagesRequestParams = z.object({
  chatGroupId: z.string().uuid(),
})