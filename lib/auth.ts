import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  providers: [
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [
          GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          }),
        ]
      : []),
    // Instant One-Click Google / Demo Auth Provider for local & preview mode
    CredentialsProvider({
      id: "google-demo",
      name: "Google (Demo)",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "developer@example.com" },
        name: { label: "Name", type: "text", placeholder: "Mridul Developer" },
      },
      async authorize(credentials) {
        const email = credentials?.email || "mridul.evaluator@gmail.com";
        const name = credentials?.name || "Mridul (Evaluator)";
        return {
          id: `usr_${email.replace(/[^a-zA-Z0-9]/g, "_")}`,
          name,
          email,
          image: "https://lh3.googleusercontent.com/a/default-user=s96-c",
        };
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (session?.user && token?.sub) {
        (session.user as any).id = token.sub;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
      }
      return token;
    },
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET || "evalforge_super_secret_jwt_key_2026_eval",
};
