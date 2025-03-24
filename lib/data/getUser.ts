import { prisma } from "@/db/prisma";
import { User } from "@prisma/client";

export async function getUserByEmail(email:string): Promise<User | null> {
  try {
    const user = await prisma.user.findFirst({ where: { email }});
    return user;
  } catch {
    return null;
  }
}