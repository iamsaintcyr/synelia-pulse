'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { Button } from '@/components/ui/Button'
import { Input, FormField } from '@/components/ui/Input'
import { Callout } from '@/components/ui/Callout'
import { Card } from '@/components/ui/Card'

export default function LoginPage() {
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState<string | null>(null)
  const [loading, setLoading]   = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    })

    if (result?.error) {
      setError('Identifiants incorrects. Vérifiez votre adresse e-mail et votre mot de passe.')
      setLoading(false)
    } else {
      window.location.href = '/admin'
    }
  }

  return (
    <main className="min-h-screen bg-gray-light flex items-center justify-center px-md">
      <div className="w-full max-w-[400px] flex flex-col gap-xl">

        <header className="text-center">
          <span className="font-display font-bold text-primary text-sm tracking-widest uppercase">
            Synelia
          </span>
          <h1 className="font-display font-bold text-primary-dark text-2xl mt-sm">
            Connexion
          </h1>
          <p className="text-gray-text text-sm mt-xs">Administration — Pôle Développement</p>
        </header>

        <Card>
          <form onSubmit={handleSubmit} className="flex flex-col gap-lg">
            {error && <Callout variant="error">{error}</Callout>}

            <FormField label="Adresse e-mail">
              <Input
                type="email"
                name="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </FormField>

            <FormField label="Mot de passe">
              <Input
                type="password"
                name="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </FormField>

            <Button variant="accent" type="submit" disabled={loading} className="w-full">
              {loading ? 'Connexion…' : 'Se connecter'}
            </Button>
          </form>
        </Card>

      </div>
    </main>
  )
}
