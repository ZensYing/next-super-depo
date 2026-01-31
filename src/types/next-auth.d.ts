import NextAuth from "next-auth"

declare module "next-auth" {
    interface User {
        role?: string
        vendorId?: string | null
    }

    interface Session {
        user: {
            id: string
            role?: string
            vendorId?: string | null
        } & DefaultSession["user"]
    }
}
