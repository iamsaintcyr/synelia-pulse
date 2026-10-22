import Link from 'next/link'
import { CheckCircle, ChevronLeft } from 'lucide-react'

export default function MerciPage() {
  return (
    <main className="min-h-screen bg-gray-light py-3xl px-md">
      <div className="max-w-[560px] mx-auto flex flex-col gap-xl">

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo-couleur.png" alt="Synelia" className="h-10 w-auto self-start" />

        <div className="bg-white rounded-lg shadow-sm border border-border overflow-hidden">

          <div className="h-[3px] bg-success" />

          <div className="p-lg flex flex-col gap-lg">

            <CheckCircle className="text-success" size={40} aria-hidden="true" />

            <h1
              className="font-display font-bold text-primary-dark"
              style={{ fontSize: 'clamp(1.75rem, 4vw, 2.25rem)', lineHeight: 1.15 }}
            >
              Merci pour votre contribution&nbsp;!
            </h1>

            <p className="font-body text-ink" style={{ fontSize: '1rem', lineHeight: 1.6, maxWidth: '58ch' }}>
              Votre retour aidera le Pôle Développement à identifier des pistes d&apos;amélioration
              et à faire évoluer son fonctionnement. Les réponses seront analysées collectivement.
            </p>

            <Link
              href="/"
              className="inline-flex items-center gap-xs font-body font-semibold text-[0.9375rem] text-slate hover:text-primary-dark transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 rounded-sm self-start"
            >
              <ChevronLeft size={16} aria-hidden="true" />
              Retour à l&apos;accueil
            </Link>

          </div>
        </div>

      </div>
    </main>
  )
}
