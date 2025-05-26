import type { ChatGroup } from "../repositories/db"

type ChatProps = {
  chatGroup: ChatGroup
}

export const Chat = ({chatGroup}: ChatProps) => {
  return (
    <div>
      <h2>Selected chat: {chatGroup.name}</h2>
      <p>Messages go here</p>
    </div>
  )
}

