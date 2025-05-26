import { useLiveQuery } from "dexie-react-hooks";
import { useCallback, useEffect } from "react"
import { db } from "./db";
import { useMutation, useQuery } from "@tanstack/react-query";
import type { ChatGroup, JoinChatGroupRequestModel, PostChatGroupRequestModel } from "@chat-app/common";
import { useGet, usePost } from "./api";

export const useGetChatGroups = () => {
  const get = useGet<ChatGroup[]>('/chats/groups')
  
  const { data, isFetching } = useQuery<ChatGroup[]>({
    queryKey: ['chatGroups'],
    queryFn: async () => {
      return get()
    },
  })

  useEffect(() => {
    if (data) {
      // overwriting everything for now - could be more strategic and only update changed items
      db.chatGroups.clear()
        .then(() => {
          return db.chatGroups.bulkAdd(data)
        })
    }
  }, [data]) // when new data arrives, push it to the local database

  const chatGroups = useLiveQuery(() => db.chatGroups.toArray())

  return {
    chatGroups,
    isFetching,
  }
}

export const useCreateChatGroup = () => {
  const post = usePost('/chats/groups')

  const { mutate } = useMutation({
    mutationFn: async (chatGroup: PostChatGroupRequestModel) => {
      return post(chatGroup)
    },
    onError: (error, chatGroup) => {
      console.error(error)
      // delete any entities created optimistically
      db.chatGroups.delete(chatGroup.id)
      db.chatMessages.where('chatGroupId').equals(chatGroup.id).delete()
      // TODO show a toast error message
    },
  })

  return useCallback((chatGroup: PostChatGroupRequestModel) => {
    db.chatGroups.add({
      ...chatGroup,
      createdAt: new Date().toISOString(),
      isMember: false
    }) // optimistically add the new chat group to the local DB

    mutate(chatGroup) // also send off to the server
  }, [mutate])
}

export const useJoinChatGroup = () => {
  const post = usePost('/chats/groups/join')

  const { mutate } = useMutation({
    mutationFn: async (body: JoinChatGroupRequestModel) => {
      return post(body)
    },
    onError: (error, { chatGroupId }) => {
      console.error(error)
      // undo the optimistic update
      // TODO: we probably want some better error handling here. We're assuming that when the request fails, we are not longer
      // a member of the chat group, but that might not be the case.
      db.chatGroups.update(chatGroupId, {
        isMember: false
      })
      // TODO show a toast error message
    },
  })

  return useCallback((chatGroupId: string) => {
    const body: JoinChatGroupRequestModel = {
      chatGroupId,
    }

    db.chatGroups.update(chatGroupId, {
      isMember: true
    }) // optimistically update the chat group in the local DB

    mutate(body) // also send off to the server
  }, [mutate])
}