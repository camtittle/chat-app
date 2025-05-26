import { createContext } from "react"
import { type User } from "@chat-app/common"

export type UserContextType = {
  selectedUser: User
  setSelectedUser: (user: User) => void
}

export const UserContext = createContext<UserContextType>({
  selectedUser: { id: '', userName: '' },
  setSelectedUser: () => {},
})