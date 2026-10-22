import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email:    { label: 'Email',           type: 'email'    },
        password: { label: 'Mot de passe',    type: 'password' },
      },
      authorize: async (credentials) => {
        const email    = credentials?.email    as string | undefined
        const password = credentials?.password as string | undefined
        if (!email || !password) return null
        if (email !== process.env.ADMIN_EMAIL) return null
        const hash = process.env.ADMIN_PASSWORD_HASH
        if (!hash) return null
        const valid = await bcrypt.compare(password, hash)
        return valid ? { id: '1', email } : null
      },
    }),
  ],
  pages: { signIn: '/admin/login' },
  session: { strategy: 'jwt' },
})
