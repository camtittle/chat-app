import { Request, Response } from "express"
import * as chatGroupService from "../../services/chatGroupService.js"
import { joinChatGroupRequestSchema } from "@chat-app/common"

export const joinChatGroup = async (req: Request, res: Response) => {
  // Validate request body against the schema
  const { chatGroupId, userId } = await joinChatGroupRequestSchema.parseAsync(req.body)
  await chatGroupService.addUserToChatGroup(chatGroupId, userId)
  res.status(200)
}