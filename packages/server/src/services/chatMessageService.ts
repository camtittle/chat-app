import { prisma } from "./prisma.js";

// TODO add userId and ensure user is member of group before returning messages
export const getChatMessages = async (chatGroupId: string) => {
  if (!chatGroupId) {
    throw new Error("Chat group ID is required")
  }

  const chatGroup = await prisma.chatGroup.findUnique({
    where: { id: chatGroupId },
    include: {
      messages: {
        include: {
          user: {
            select: {
              id: true,
              username: true,
            },
          },
        },
        orderBy: {
          createdAt: 'asc',
        }
      },
    },
  })

  if (!chatGroup) {
    throw new Error(`Chat group with id ${chatGroupId} does not exist`)
  }

  return chatGroup.messages.map(message => ({ 
    id: message.id,
    chatGroupId: message.chatGroupId,
    userId: message.userId,
    createdAt: message.createdAt,
    content: message.content,
    user: {
      id: message.user.id,
      username: message.user.username,
    },
  }))
}

type CreateChatMessageParams = {
  id: string
  userId: string
  chatGroupId: string
  content: string
}

export const createChatMessage = async ({ userId, chatGroupId, content, id }: CreateChatMessageParams) => {
  if (!userId || !chatGroupId || !content || !id) {
    throw new Error("ID, User ID, chat group ID, and content are required")
  }

  const chatGroup = await prisma.chatGroup.findUnique({
    where: { id: chatGroupId },
  })
  if (!chatGroup) {
    throw new Error(`Chat group with id ${chatGroupId} does not exist`)
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      chatGroups: {
        where: { id: chatGroupId }, // Ensure the user is part of the chat group
      }
    }
  })
  if (!user) {
    throw new Error(`User with id ${userId} does not exist`)
  }
  if (!user.chatGroups?.length) {
    throw new Error(`User with id ${userId} is not a member of chat group ${chatGroupId}`)
  }

  const chatMessage = await prisma.message.create({
    data: {
      id,
      userId,
      chatGroupId,
      content,
      createdAt: new Date(), // TODO have client send timestamp instead to better support messages sent while offline
    },
  })

  return chatMessage
}