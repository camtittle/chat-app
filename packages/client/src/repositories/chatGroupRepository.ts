import { useLiveQuery } from "dexie-react-hooks";
import { useCallback, useEffect } from "react"
import { db, type ChatGroup } from "./db";
import { useMutation, useQuery } from "@tanstack/react-query";
import { buildApiRoute } from "./utils";
import type { PostChatGroupRequestModel } from "@chat-app/common";

export const useGetChatGroups = () => {
  const { data, isFetching } = useQuery<ChatGroup[]>({
    queryKey: ['chatGroups'],
    queryFn: async () => {
      const response = await fetch(buildApiRoute('/chats/groups'));
      if (!response.ok) {
        throw new Error('Failed to fetch chat groups');
      }
      return response.json();
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

  const useChatGroupsLiveQuery = useLiveQuery(() => db.chatGroups.toArray())

  return {
    chatGroups: useChatGroupsLiveQuery,
    isFetching,
  }
}

export const useCreateChatGroup = () => {
  const { mutate } = useMutation({
    networkMode: 'offlineFirst',
    mutationFn: async (chatGroup: PostChatGroupRequestModel) => {
      const response = await fetch(buildApiRoute('/chats/groups'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(chatGroup),
      });

      if (!response.ok) {
        throw new Error('Failed to create chat group')
      }

      return response.json()
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
      isMember: false
    }) // optimistically add the new chat group to the local DB

    mutate(chatGroup) // also send off to the server
  }, [mutate])
}