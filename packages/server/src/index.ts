import express, { Application, json } from 'express'
import dotenv from 'dotenv'
import { postChatGroup, getChatGroups, joinChatGroup, getChatMessages, postChatMessage } from './controllers/index.js'
import cors from 'cors'
import { errorHandlerMiddleware } from './middleware/errorHandlerMiddleware.js'

dotenv.config()

const app: Application = express()
const port = process.env.PORT || 8000

app.use(cors({
  origin: 'http://localhost:5173',
  methods: '*',
  allowedHeaders: '*'
}))

app.use(json())

app.post('/chats/groups', postChatGroup)
app.get('/chats/groups', getChatGroups)
app.post('/chats/groups/join', joinChatGroup)
app.get('/chats/groups/:chatGroupId/messages', getChatMessages)
app.post('/chats/groups/:chatGroupId/messages', postChatMessage)

app.use(errorHandlerMiddleware)

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`)
})
