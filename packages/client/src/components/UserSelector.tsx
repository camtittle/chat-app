import { users } from "@chat-app/common"
import { Select } from "./Select"
import { useCurrentUser } from "../contexts/UserContext/UserContext"


export const UserSelector = () => {
  const currentUser = useCurrentUser()

  const handleSelectUser = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedUserId = e.target.value
    const selectedUser = users.find(user => user.id === selectedUserId)
    if (selectedUser) {
      currentUser.setSelectedUser(selectedUser)
    }
  }

  return (
    <Select value={currentUser.selectedUser.id} onChange={handleSelectUser}>
      {users.map((user) => (
        <option key={user.id} value={user.id}>
          {user.username}
        </option>
      ))}
    </Select>
  )

}