import { useMemo, useState } from "react"
import { type User } from "@chat-app/common"
import { defaultUser, UserContext } from "./UserContext"

type UserProviderProps = {
  children: React.ReactNode
}

export const UserProvider = ({ children }: UserProviderProps) => {
  const [selectedUser, setSelectedUser] = useState<User>({ ...defaultUser })
  const value = useMemo(() => ({ selectedUser, setSelectedUser }), [selectedUser])

  return <UserContext.Provider value={value}>
    {children}
  </UserContext.Provider>
}