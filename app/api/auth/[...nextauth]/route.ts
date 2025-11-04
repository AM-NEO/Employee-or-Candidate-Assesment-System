import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { getAdminByCredentials } from '@/lib/persistentAdminDB';

const providers = [
  CredentialsProvider({
      name: 'credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          return null;
        }
        
        const admin = await getAdminByCredentials(credentials.username, credentials.password);
        if (admin) {
          return {
            id: admin.id.toString(),
            name: admin.name,
            email: admin.email,
          };
        }
        return null;
      },
    }),
];

const handler = NextAuth({
  providers,
  pages: {
    signIn: '/auth/signin',
    signOut: '/dashboard',
  },
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        (session.user as any).id = token.id as string;
      }
      return session;
    },
  },
});

export { handler as GET, handler as POST };