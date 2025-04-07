"use server"

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


export async function getUserById(id:string): Promise<User | null> {
  try {
    const user = await prisma.user.findUnique({ where: { id }});
    return user;
  } catch {
    return null;
  }
}