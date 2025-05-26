import { RequestHandler } from "express"
import * as userService from "../services/userService.js"

declare global {
  namespace Express {
    interface Request {
      user: {
        id: string
        username: string
      }
    }
  }
}

/**
 * For demo we use the user ID as an auth token.
 */
export const authMiddleware: RequestHandler = async (req, res, next) => {
  const userId = req.headers.authorization?.split(' ')[1]

  if (!userId) {
    res.status(401).json({ message: 'Unauthorized' })
    return
  }

  const user = await userService.getUser(userId)

  if (!user) {
    res.status(401).json({ message: 'Unauthorized' })
    return
  }

  req.user = {
    id: user.id,
    username: user.username,
  }

  next()
}