import Dexie, { type EntityTable } from 'dexie'

export interface ChatGroup {
  id: string
  name: string
  isMember: boolean
}

export interface ChatMessage {
  id: number
  chatGroupId: string
  senderId: string
  content: string
  sentAt: Date
}

export const db = new Dexie('chat-app-db') as Dexie & {
  chatGroups: EntityTable<
    ChatGroup,
    'id'
  >,
  chatMessages: EntityTable<
    ChatMessage,
    'id'
  >
}

db.version(1).stores({
  chatGroups: 'id, name',
  chatMessages: 'id, chatGroupId'
})