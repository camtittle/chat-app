import { Request, Response } from "express"
import * as chatGroupService from "../../services/chatGroupService.js"
import { ChatGroup } from "@chat-app/common"

export const getChatGroups = async (req: Request, res: Response) => {
  const chatGroups = await chatGroupService.getChatGroups()

  const response: ChatGroup[] = chatGroups.map(group => ({
    id: group.id,
    name: group.name,
    createdAt: group.createdAt.toISOString(),
    isMember: group.users.some(user => user.id === req.user.id),
  }))

  res.status(200).json(response)
}