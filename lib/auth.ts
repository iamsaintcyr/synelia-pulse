import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { loginLimiter } from '@/lib/rateLimit'
import { createHash } from 'crypto'

function emailKey(email: string): string {
  return 'login:' + createHash('sha256').update(email.toLowerCase()).digest('hex').slice(0, 16)
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email:    { label: 'Email',        type: 'email'    },
        password: { label: 'Mot de passe', type: 'password' },
      },
      authorize: async (credentials) => {
        const email    = credentials?.email    as string | undefined
        const password = credentials?.password as string | undefined
        if (!email || !password) return null

        // Rate-limit by hashed email: 5 attempts / 10 min before lockout
        if (!loginLimiter(emailKey(email))) return null

        if (email !== process.env.ADMIN_EMAIL) return null

        const hash = process.env.ADMIN_PASSWORD_HASH
        if (!hash) return null

        const valid = await bcrypt.compare(password, hash)
        return valid ? { id: '1', email } : null
      },
    }),
  ],
  pages:   { signIn: '/admin/login' },
  session: { strategy: 'jwt', maxAge: 8 * 3600 },
})
