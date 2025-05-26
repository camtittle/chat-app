import { users } from "@chat-app/common"
import { PrismaClient } from "../generated/prisma/index.js"
import dotenv from 'dotenv'

dotenv.config()

const prisma = new PrismaClient()

async function main() {
  await Promise.all(users.map(user =>
    prisma.user.upsert({
      where: { id: user.id },
      create: {
        id: user.id,
        username: user.username,
      },
      update: {
        id: user.id,
        username: user.username,
      }
    })
  ))
}
main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })