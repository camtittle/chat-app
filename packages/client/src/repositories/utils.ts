import { API_BASE_URL } from "../config"

export const buildApiRoute = (path: string): string => {
  return API_BASE_URL + path
}