import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Enquête de satisfaction — Pôle Développement Synelia',
  description: 'Partagez votre expérience au sein du Pôle Développement de Groupe Synelia.',
  robots: 'noindex, nofollow',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <head>
        <meta name="robots" content="noindex, nofollow" />
      </head>
      <body>{children}</body>
    </html>
  )
}
