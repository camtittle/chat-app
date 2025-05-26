import { createContext, useContext } from "react"
import { type User, users } from "@chat-app/common"

export type UserContextType = {
  selectedUser: User
  setSelectedUser: (user: User) => void
}

export const defaultUser = users[0]

export const UserContext = createContext<UserContextType>({
  selectedUser: { ...defaultUser },
  setSelectedUser: () => {},
})

export const useCurrentUser = () => {
  return useContext(UserContext)
}