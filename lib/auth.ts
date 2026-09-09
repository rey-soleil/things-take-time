import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import clientPromise from "./mongo/client";

const adapter = process.env.MONGODB_URI
  ? MongoDBAdapter(clientPromise)
  : undefined;

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  pages: {
    signIn: "/signin",
  },
  callbacks: {
    async session({ session, user }: any) {
      session.user.id = user.id;
      session.user.calendarId = user.calendarId;
      session.user.todoistAPIToken = user.todoistAPIToken;
      return session;
    },
  },
  ...(adapter ? { adapter } : {}),
};
