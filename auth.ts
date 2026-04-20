import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import { authConfig } from "./auth.config";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
        const subscription = await prisma.subscription.findUnique({
          where: { userId: token.sub },
        });
        (session.user as any).planId = subscription?.planId ?? "free";
        (session.user as any).subscriptionStatus = subscription?.status ?? "free";
      }
      return session;
    },
    async jwt({ token, account }) {
      if (account?.provider === "github" && account.access_token) {
        token.githubAccessToken = account.access_token;
      }
      return token;
    },
  },
});
