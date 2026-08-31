import NextAuth, { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      email: string
      name? : string
      image? : string | null
      journalPassword? : string,
    } & DefaultSession["user"]
  }

  interface User {
    id: string
    email: string
    name? : string
    image? : string | null
    journalPassword? : string,
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    email: string
    name?: string
    image? : string | null
    journalPassword? : string,
  }
}
