import { prisma } from "./prisma.js";

export const getUser = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  })

  return user
}