import NextAuth from "next-auth";
import prisma from "./prisma";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { Adapter } from "next-auth/adapters";
import GitHub from "next-auth/providers/github";

export const { handlers, signIn, signOut, auth } = NextAuth({
    adapter: PrismaAdapter(prisma) as Adapter,
    trustHost: true,
    providers:[GitHub],
    callbacks: {
        async redirect({ url, baseUrl }) {
            // Garante redirecionamento para o domínio correto
            if (url.startsWith("/")) return `${baseUrl}${url}`;
            else if (new URL(url).origin === baseUrl) return url;
            return baseUrl;
        }
    }
})