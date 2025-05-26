import { ChatMessage } from "./ChatMessage"
import { useCreateChatMessage, useGetChatMessages } from "../../repositories/chatMessageRepository"
import { v4 as uuid } from "uuid"
import { ChatMessageForm } from "./ChatMessageForm"
import type { ChatGroup } from "@chat-app/common"

type ChatProps = {
  chatGroup: ChatGroup
}

export const Chat = ({chatGroup}: ChatProps) => {
  const { chatMessages } = useGetChatMessages(chatGroup.id)
  const createChatMessage = useCreateChatMessage(chatGroup.id)

  const handleSubmitMessage = (messageContent: string) => {
    const trimmedContent = messageContent?.trim()
    if (!trimmedContent) {
      return
    }

    createChatMessage({
      id: uuid(),
      content: messageContent,
    })
  }

  return (
    <div>
      <h2>Selected chat: {chatGroup.name}</h2>
      <div>
        {chatMessages?.map(message => (<ChatMessage key={message.id} message={message} />))}
      </div>
      <ChatMessageForm onSubmit={handleSubmitMessage} />
    </div>
  )
}

