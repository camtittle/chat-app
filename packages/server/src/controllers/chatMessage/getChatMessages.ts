import { getChatMessagesRequestParams } from "@chat-app/common";
import { Request, Response } from "express";
import * as chatMessageService from "../../services/chatMessageService.js"

export const getChatMessages = async (req: Request, res: Response) => {
  // Validate request body against the schema
  const { chatGroupId } = await getChatMessagesRequestParams.parseAsync(req.params)

  const messages = await chatMessageService.getChatMessages(chatGroupId)

  res.status(200).json(messages.map(message => ({
    id: message.id,
    chatGroupId: message.chatGroupId,
    userId: message.userId,
    createdAt: message.createdAt,
    content: message.content,
    user: {
      id: message.user.id,
      username: message.user.username,
    },
  })))
}