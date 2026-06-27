import { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import GoogleProvider from "next-auth/providers/google";
import { db } from "./prisma";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { getUserByEmail } from "@/utils/user";

export const authOptions : NextAuthOptions = {
  adapter: PrismaAdapter(db),
  providers : [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("All fields are required");
        }

        const user = await getUserByEmail(credentials.email);
        if (!user || !user.password) {
          throw new Error("User neexistent");
        }

        const isMatch = await bcrypt.compare(credentials.password, user.password);
        if (!isMatch) {
          throw new Error("Invalid credentials");
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name ?? undefined,
        };
      }
    })
  ],
  session : {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks : {
    async jwt({ token, user}) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
      }
      return token;
    },

    async session( {session, token}) {
      if(token && session.user){
        session.user.id = token.id;
        session.user.email = token.email;
        session.user.name = token.name;
      }

      return session;
    }
  }
}