import { type ChatMessage as ChatMessageData } from "@chat-app/common"


type ChatMessageProps = {
  message: ChatMessageData
}

export const ChatMessage = ({ message }: ChatMessageProps) => {
  return (
    <div>
      <p><strong>{message.user.username}</strong>: {message.content}</p>
    </div>
  )

}