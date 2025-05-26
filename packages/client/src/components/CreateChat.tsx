import styled from "styled-components"
import { useCreateChatGroup } from "../repositories/chatGroupRepository"
import { Input } from "./Input"
import { Button } from "./Button"
import { v4 as uuid } from "uuid"
import { useState } from "react"

export const CreateChat = () => {
  // TODO: add a form validation library like react-hook-form
  const [chatName, setChatName] = useState("")
  const postChatGroup = useCreateChatGroup()

  const handleClickCreateChat = () => {
    postChatGroup({
      id: uuid(),
      name: chatName,
    })
  }

  return (
    <InputsContainer>
      <Input type="text" placeholder="Group name" value={chatName} onChange={(e => setChatName(e.target.value))} />
      <Button onClick={(() => handleClickCreateChat())}>Create chat group</Button>
    </InputsContainer>
  )
}

const InputsContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 8px;
  justify-content: space-between;
`