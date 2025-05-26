import { postChatGroupSchema } from "@chat-app/common";
import { Request, Response } from "express";
import * as chatGroupService from "../../services/index.js"

export const postChatMessage = async (req: Request, res: Response) => {
  const body = await postChatGroupSchema.parseAsync(req.body); // Validate request body against the schema

  // TODO: add createdBy to chat group
  const createdChatGroup = await chatGroupService.createChatGroup({
    id: body.id,
    name: body.name,
  })

  res.status(201).json({
    id: createdChatGroup.id,
    name: createdChatGroup.name,
  })
}