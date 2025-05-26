import type { ChatMessage, PostChatMessageRequestModel } from "@chat-app/common"
import { useMutation, useQuery } from "@tanstack/react-query"
import { useCallback, useEffect } from "react"
import { db } from "./db"
import { useLiveQuery } from "dexie-react-hooks"
import { useCurrentUser } from "../contexts/UserContext/UserContext"
import { useGet, usePost } from "./api"

export const useGetChatMessages = (chatGroupId: string) => {
  const get = useGet<ChatMessage[]>(`/chats/groups/${chatGroupId}/messages`)

  const { data, isFetching } = useQuery<ChatMessage[]>({
    queryKey: ['chatMessages', chatGroupId],
    queryFn: async () => {
      return get()
    },
    refetchInterval: 5000, // refetch every 5 seconds. in future could use a webhook instead of polling
  })

  useEffect(() => {
    if (data) {
      db.chatMessages.bulkPut(data)
      // delete any messages that are not in the new data
      const messageIdsToKeep = new Set(data.map(message => message.id))
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
  const post = usePost(`/chats/groups/${chatGroupId}/messages`)
  const { selectedUser } = useCurrentUser()

  const { mutate } = useMutation({
    mutationFn: async (message: CreateMessageParams) => {
      return post({
        ...message,
      })
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