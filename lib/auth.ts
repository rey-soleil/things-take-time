import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import GoogleProvider from "next-auth/providers/google";
import clientPromise from "./mongo/client";

export const authOptions = {
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
    // TODO: add types to session, user
    async session({ session, user }: any) {
      session.user.id = user.id;
      session.user.calendarId = user.calendarId;
      return session;
    },
  },
  adapter: MongoDBAdapter(clientPromise),
};
