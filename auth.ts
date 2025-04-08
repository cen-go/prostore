import NextAuth from "next-auth";
import authConfig from "./auth.config"
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google"
import { compareSync } from "bcrypt-ts-edge";
import { getUserByEmail } from "./lib/data/getUser";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/db/prisma";
import { cookies } from "next/headers";

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
    async jwt({ token, user, trigger}: any) {
      if (user) {
        token.id = user.id;
        token.role = user.role;

        if (trigger === "signIn" || trigger === "signUp") {
          const cookiesObject = await cookies()
          const sessionCartId = cookiesObject.get("sessionCartId")?.value;

          if (sessionCartId) {
            const sessionCart = await prisma.cart.findFirst({
              where: {sessionCartId}
            })

            if (!sessionCart) return token

            if (sessionCart.userId !== user.id) {
              // delete any cart the user may previously created
              await prisma.cart.deleteMany({where: {userId: user.id}});
            }
            // Assign new cart
            await prisma.cart.update({
              where: {id: sessionCart.id},
              data: {userId: user.id},
            });
          }
        }
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
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  session: { strategy: "jwt", maxAge: 30 * 24 * 60 * 60 },
  adapter: PrismaAdapter(prisma),
});
