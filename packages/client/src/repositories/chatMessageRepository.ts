import type { ChatMessage, PostChatMessageRequestModel } from "@chat-app/common"
import { useMutation, useQuery } from "@tanstack/react-query"
import { buildApiRoute } from "./utils"
import { useCallback, useEffect } from "react"
import { db } from "./db"
import { useLiveQuery } from "dexie-react-hooks"
import { useCurrentUser } from "../contexts/UserContext/UserContext"

export const useGetChatMessages = (chatGroupId: string) => {
  const { data, isFetching } = useQuery<ChatMessage[]>({
    queryKey: ['chatMessages', chatGroupId],
    queryFn: async () => {
      const response = await fetch(buildApiRoute(`/chats/groups/${chatGroupId}/messages`))
      if (!response.ok) {
        throw new Error('Failed to fetch chat messages')
      }
      return response.json()
    },
    refetchInterval: 1000, // refetch every second. in future could use a webhook instead of polling
  })

  useEffect(() => {
    if (data) {
      db.chatMessages.bulkAdd(data)
      const messageIdsToKeep = new Set(data.map(message => message.id))
      // delete any messages that are not in the new data
      db.chatMessages.where('chatGroupId').equals(chatGroupId)
        .filter(message => !messageIdsToKeep.has(message.id))
        .delete()
    }
  }, [data, chatGroupId]) // when new data arrives, push it to the local database

  const chatMessages = useLiveQuery(() => db.chatMessages.where('chatGroupId').equals(chatGroupId).sortBy('createdAt'), [chatGroupId])

  return {
    chatMessages,
    isFetching,
  }
}

type CreateMessageParams = Pick<PostChatMessageRequestModel, 'id' | 'content'>

export const useCreateChatMessage = (chatGroupId: string) => {
  const { selectedUser } = useCurrentUser()

  const { mutate } = useMutation({
    mutationFn: async (message: CreateMessageParams) => {
      const response = await fetch(buildApiRoute(`/chats/groups/${chatGroupId}/messages`), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...message,
          userId: selectedUser.id,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message')
      }

      return response.json()
    },
    onError: (error, message) => {
      console.error(error)
      // delete any entities created optimistically
      db.chatMessages.delete(message.id)
      // TODO show a toast error message
    },
  })

  return useCallback((message: CreateMessageParams) => {
    db.chatMessages.add({
      ...message,
      chatGroupId,
      userId: selectedUser.id,
      user: selectedUser,
      createdAt: new Date().toISOString(),
    }) // optimistically add the new chat group to the local DB

    mutate(message) // also send off to the server
  }, [mutate, selectedUser, chatGroupId])
}