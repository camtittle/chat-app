import { prisma } from "./prisma.js"

interface CreateChatGroupParams {
  id: string
  name: string
}

export const createChatGroup = async (chatGroup: CreateChatGroupParams) => {
  const { id, name } = chatGroup;

  const existingGroup = await prisma.chatGroup.findUnique({
    where: { id },
  })

  if (existingGroup) {
    throw new Error(`Chat group with id ${id} already exists`)
  }
  const newChatGroup = await prisma.chatGroup.create({
    data: {
      id,
      name,
    },
  })

  return newChatGroup
}

export const addUserToChatGroup = async (chatGroupId: string, userId: string) => {
  if (!chatGroupId || !userId) {
    throw new Error("Chat group ID and user ID are required")
  }

  const chatGroup = await prisma.chatGroup.findUnique({
    where: { id: chatGroupId },
  })

  if (!chatGroup) {
    throw new Error(`Chat group with id ${chatGroupId} does not exist`)
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
  })

  if (!user) {
    throw new Error(`User with id ${userId} does not exist`)
  }

  await prisma.chatGroup.update({
    where: { id: chatGroupId },
    data: {
      users: {
        connect: { id: userId },
      },
    },
  })
}

export const getChatGroups = async () => {
  const chatGroups = await prisma.chatGroup.findMany({
    include: {
      users: {
        select: {
          id: true,
          username: true,
        },
      },
    },
    orderBy: {
      name: 'asc',
    },
  })

  return chatGroups
}