import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Resend from "next-auth/providers/resend";
import { prisma } from "@/lib/prisma";
import { authConfig } from "./auth.config";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    ...authConfig.providers.map((provider: any) => {
      if (provider.id === "github") {
        return {
          ...provider,
          profile(profile: any) {
            return {
              id: String(profile.id),
              name: profile.name ?? profile.login,
              email: profile.email ?? `${profile.id}+${profile.login}@users.noreply.github.com`,
              image: profile.avatar_url,
              githubUsername: profile.login,
            };
          },
        };
      }
      return provider;
    }),
    Resend({
      apiKey: process.env.RESEND_API_KEY!,
      from: process.env.EMAIL_FROM ?? "noreply@praxis.app",
    }),
  ],
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
