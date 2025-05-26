import { useCallback } from "react"
import { useCurrentUser } from "../contexts/UserContext/UserContext"
import { buildApiRoute } from "./utils"

export const usePost = (path: string) => {
  const { selectedUser } = useCurrentUser()

  return useCallback(async <TBody, TResponse = unknown>(body: TBody): Promise<TResponse> => {
    const response = await fetch(buildApiRoute(path), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${selectedUser.id}`, // For demo using user ID as token
      },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      throw new Error(`Request to ${path} failed`)
    }

    return response.json() as Promise<TResponse>
  }, [path, selectedUser.id])
}

export const useGet = <TResponse>(path: string) => {
  const { selectedUser } = useCurrentUser()

  return useCallback(async (): Promise<TResponse> => {
    const response = await fetch(buildApiRoute(path), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${selectedUser.id}`, // For demo using user ID as token
      },
    })

    if (!response.ok) {
      throw new Error(`Request to ${path} failed`)
    }

    return response.json() as Promise<TResponse>
  }, [path, selectedUser.id])
}