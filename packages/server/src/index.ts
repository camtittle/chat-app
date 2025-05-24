import express, { Application } from 'express';
import dotenv from 'dotenv';
import { postChatGroup, getChatGroups } from './controllers';

dotenv.config()

const app: Application = express()
const port = process.env.PORT || 8000

app.post('/chat/groups', postChatGroup)
app.get('/chat/groups', getChatGroups)

app.listen(port, () => {
  console.log(`Server is running at https://localhost:${port}`)
})