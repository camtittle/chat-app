export type ChatMessage = {
  id: string
  chatGroupId: string
  userId: string
  content: string
  createdAt: string
  user: {
    id: string
    username: string
  }
}