import { Request, Response } from "express"
import * as chatGroupService from "../../services/chatGroupService.js"

export const getChatGroups = async (_req: Request, res: Response) => {
  const chatGroups = await chatGroupService.getChatGroups()

  res.status(200).json(chatGroups.map(group => ({
    id: group.id,
    name: group.name,
    createdAt: group.createdAt, 
  })))
}