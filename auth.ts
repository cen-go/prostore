import NextAuth from "next-auth";
import authConfig from "./auth.config"
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/db/prisma";

export const { handlers, signIn, signOut, auth } = NextAuth({
  pages: {
    signIn: "/sign-in",
    error: "/sign-in",
  },
  callbacks: {
    async session({session, user, trigger, token}) {
      // Set the user ID from token.
      session.user.id = token.sub as string;

      // If there is an update, set the user name
      if (trigger === "update") {
        session.user.name = user.name
      }
      return session;
    }
  },
  session: { strategy: "jwt", maxAge: 30 * 24 * 60 * 60 },
  adapter: PrismaAdapter(prisma),
  ...authConfig,
});
