import { NextAuthOptions, User as NextAuthUser } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

interface ExtendedUser extends NextAuthUser {
  firstName: string
  lastName: string
  phoneNumber: string
}

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      email: string
      name: string
      firstName: string
      lastName: string
      phoneNumber: string
    }
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    userId?: string
    firstName?: string
    lastName?: string
    phoneNumber?: string
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        })

        if (!user) {
          return null
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        )

        if (!isPasswordValid) {
          return null
        }

        return {
          id: user.id,
          email: user.email,
          name: `${user.firstName} ${user.lastName}`,
          firstName: user.firstName,
          lastName: user.lastName,
          phoneNumber: user.phoneNumber
        }
      }
    })
  ],
  session: {
    strategy: 'jwt'
  },
  pages: {
    signIn: '/',
    error: '/'
  },
  cookies: {
    sessionToken: {
      name: `${process.env.NODE_ENV === 'production' ? '__Secure-' : ''}next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production'
      }
    }
  },
  useSecureCookies: process.env.NODE_ENV === 'production',
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const extendedUser = user as ExtendedUser
        token.firstName = extendedUser.firstName
        token.lastName = extendedUser.lastName
        token.phoneNumber = extendedUser.phoneNumber
      }
      return token
    },
    async session({ session, token }) {
      const userId = String(token.sub)
      const firstName = String(token.firstName || '')
      const lastName = String(token.lastName || '')
      const phoneNumber = String(token.phoneNumber || '')

      return {
        ...session,
        user: {
          ...session.user,
          id: userId,
          firstName: firstName,
          lastName: lastName,
          phoneNumber: phoneNumber
        }
      }
    }
  },
  secret: process.env.NEXTAUTH_SECRET
}