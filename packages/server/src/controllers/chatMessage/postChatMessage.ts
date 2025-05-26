import { postChatMessageSchema } from "@chat-app/common";
import { Request, Response } from "express";
import * as chatMessageService from "../../services/chatMessageService.js"

export const postChatMessage = async (req: Request, res: Response) => {
  // Validate request body against the schema
  const { id, chatGroupId, userId, content } = await postChatMessageSchema.parseAsync(req.body)

  const createdChatMessage = await chatMessageService.createChatMessage({
    id,
    chatGroupId,
    userId,
    content
  })

  res.status(201).json({
    id: createdChatMessage.id,
    chatGroupId: createdChatMessage.chatGroupId,
    userId: createdChatMessage.userId,
    createdAt: createdChatMessage.createdAt,
    content: createdChatMessage.content,
  })
}