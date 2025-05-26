import { useState } from "react"
import { useGetChatGroups } from "../repositories/chatGroupRepository"
import { Button } from "../components/Button"
import type { ChatGroup } from "../repositories/db"
import { Chat } from "./Chat"
import { CreateChat } from "../components/CreateChat"
import styled from "styled-components"

export const ChatGroupList = () => {
  const { chatGroups, isFetching } = useGetChatGroups()

  // TODO: use react router for this instead
  const [selectedChatGroup, setSelectedChatGroup] = useState<ChatGroup | null>(null)

  if (isFetching || !chatGroups) {
    return <div>Loading...</div>
  }

  const handleClickChatGroup = (chatGroup: ChatGroup) => {
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

      {selectedChatGroup && <Chat chatGroup={selectedChatGroup} />}
    </div>
  )
}

const GroupListContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`