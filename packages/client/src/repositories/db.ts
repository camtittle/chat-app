import type { ChatGroup, ChatMessage } from '@chat-app/common'
import Dexie, { type EntityTable } from 'dexie'

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
  chatMessages: 'id, chatGroupId, createdAt'
})