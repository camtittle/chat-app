import { useState } from "react"
import { useGetChatGroups, useJoinChatGroup } from "../../repositories/chatGroupRepository"
import { Button } from "../../components/Button"
import { Chat } from "../Chat/Chat"
import { CreateChat } from "./CreateChat"
import styled from "styled-components"
import type { ChatGroup } from "@chat-app/common"

export const ChatGroupList = () => {
  const { chatGroups, isFetching } = useGetChatGroups()
  const joinChatGroup = useJoinChatGroup()

  const [selectedChatGroup, setSelectedChatGroup] = useState<ChatGroup | null>(null)

  if (isFetching || !chatGroups) {
    return <div>Loading...</div>
  }

  const handleClickChatGroup = (chatGroup: ChatGroup) => {
    joinChatGroup(chatGroup.id)
    setSelectedChatGroup(chatGroup)
  }

  return (
    <div>
      <h1>Chat Groups</h1>
      <h2>Select a group to join</h2>
      <GroupListContainer>
        {chatGroups.map((group) => (
          <Button key={group.id} onClick={() => handleClickChatGroup(group)}>
            {group.name}
          </Button>
        ))}
        <CreateChat />
      </GroupListContainer>

      {/* TODO use react router for this instead */}
      {selectedChatGroup && <Chat chatGroup={selectedChatGroup} />}
    </div>
  )
}

const GroupListContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`