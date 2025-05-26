import { useLiveQuery } from "dexie-react-hooks";
import { useCallback, useEffect } from "react"
import { db, type ChatGroup } from "./db";
import { useMutation, useQuery } from "@tanstack/react-query";
import { buildApiRoute } from "./utils";
import type { JoinChatGroupRequestModel, PostChatGroupRequestModel } from "@chat-app/common";
import { useCurrentUser } from "../contexts/UserContext/UserContext";

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

  const chatGroups = useLiveQuery(() => db.chatGroups.toArray())

  return {
    chatGroups,
    isFetching,
  }
}

export const useCreateChatGroup = () => {
  const { mutate } = useMutation({
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

export const useJoinChatGroup = () => {
  const { selectedUser } = useCurrentUser()

  const { mutate } = useMutation({
    mutationFn: async (body: JoinChatGroupRequestModel) => {
      const response = await fetch(buildApiRoute('/chats/groups/join'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error('Failed to join chat group')
      }
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
      userId: selectedUser.id
    }

    db.chatGroups.update(chatGroupId, {
      isMember: true
    }) // optimistically update the chat group in the local DB

    mutate(body) // also send off to the server
  }, [mutate, selectedUser.id])
}