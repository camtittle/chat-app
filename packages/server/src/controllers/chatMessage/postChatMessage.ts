import { postChatMessageBodySchema, postChatMessageParamsSchema } from "@chat-app/common";
import { Request, Response } from "express";
import * as chatMessageService from "../../services/chatMessageService.js"

export const postChatMessage = async (req: Request, res: Response) => {
  // Validate request body against the schema
  const { id, content } = await postChatMessageBodySchema.parseAsync(req.body)
  const { chatGroupId } = await postChatMessageParamsSchema.parseAsync(req.params)

  const createdChatMessage = await chatMessageService.createChatMessage({
    id,
    chatGroupId,
    userId: req.user.id,
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