// next-auth.d.ts
import NextAuth from "next-auth";

declare module "next-auth" {
    interface Session {
        user: {
            name?: string | null;
            email?: string | null;
            image?: string | null;
            role?: string; // Add role field here
        };
    }

    interface User {
        role?: string; // Extend User type with role
    }
}
