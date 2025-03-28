import NextAuth from "next-auth";
import authConfig from "./auth.config"
import Credentials from "next-auth/providers/credentials";
import { compareSync } from "bcrypt-ts-edge";
import { getUserByEmail } from "./lib/data/getUser";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/db/prisma";

export const { handlers, signIn, signOut, auth } = NextAuth({
  pages: {
    signIn: "/sign-in",
    error: "/sign-in",
  },
  callbacks: {
    ...authConfig.callbacks,
    async session({ session, user, trigger, token }) {
      // Set the user ID from token.
      session.user.id = token.sub as string;

      // If there is an update, set the user name
      if (trigger === "update") {
        session.user.name = user.name;
      }

      if (token.role) {
        session.user.role = token.role as "user" | "admin";
      }

      return session;
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async jwt({ token, user}: any) {
      if (user) {
        token.role = user.role;
      }

      return token;
    },
    
  },
  providers: [
    Credentials({
      credentials: {
        email: { type: "email" },
        password: { type: "password" },
      },
      async authorize(credentials) {
        const user = await getUserByEmail(credentials.email as string);

        if (user && user.password) {
          const passwordsMatch = await compareSync(
            credentials.password as string,
            user.password
          );
          if (passwordsMatch) {
            return {
              id: user.id,
              name: user.name,
              email: user.email,
              role: user.role,
              image: user.image,
            };
          }
        }

        return null;
      },
    }),
  
  ],
  session: { strategy: "jwt", maxAge: 30 * 24 * 60 * 60 },
  adapter: PrismaAdapter(prisma),
});
