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

export const getChatGroups = async () => {
  const chatGroups = await prisma.chatGroup.findMany({
    orderBy: {
      name: 'asc',
    },
  })

  return chatGroups
}