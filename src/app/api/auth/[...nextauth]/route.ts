// src/app/api/auth/[...nextauth]/route.ts
import NextAuth, { NextAuthOptions, User as NextAuthUser } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";

// IMPORTANT: MOCK USER STORE - NOT FOR PRODUCTION
// In a real app, connect this to a database (e.g., using Prisma adapter)
// and hash passwords properly.
const mockUsers = [
  { id: "1", name: "Demo User", email: "user@example.com", password: "password123" },
];

const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "your@email.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Please enter your email and password.");
        }
        // Replace this with actual database lookup and password hashing/comparison
        const user = mockUsers.find(u => u.email === credentials.email);

        if (user && user.password === credentials.password) { // NEVER compare plain text passwords in prod
          return { id: user.id, name: user.name, email: user.email }; // Must return object with at least id
        } else {
          throw new Error("Invalid email or password.");
        }
      },
    }),
  ],
  pages: {
    signIn: '/signin', // Your custom sign-in page
    // You can add error: '/auth/error' if you create a custom error page
  },
  session: {
    strategy: "jwt", // Using JWT for session strategy (default if no adapter)
  },
  callbacks: {
    async jwt({ token, user }) {
      // Persist the user ID from the user object to the token right after signin
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      // Send properties to the client, like an access_token and user id from a provider.
      if (session?.user && token?.id) {
        (session.user as NextAuthUser & { id: string }).id = token.id as string;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };