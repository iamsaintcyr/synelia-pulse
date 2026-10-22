import Link from 'next/link'
import { CheckCircle } from 'lucide-react'

export default function MerciPage() {
  return (
    <main className="min-h-screen bg-gray-light py-3xl px-md">
      <div className="max-w-[720px] mx-auto flex flex-col gap-2xl">

        <header className="flex flex-col gap-sm">
          <span className="font-display font-bold text-primary text-sm tracking-widest uppercase">
            Synelia
          </span>
        </header>

        <div className="flex flex-col gap-lg items-start">
          <div className="flex items-center gap-md">
            <CheckCircle className="text-accent shrink-0" size={40} aria-hidden="true" />
            <h1 className="font-display font-bold text-primary-dark text-3xl">
              Merci pour votre contribution&nbsp;!
            </h1>
          </div>

          <p className="text-ink text-base leading-relaxed">
            Votre retour aidera le Pôle Développement à identifier des pistes d&apos;amélioration
            et à faire évoluer son fonctionnement. Les réponses seront analysées collectivement.
          </p>

          <Link
            href="/"
            className="text-accent font-display font-bold underline-offset-2 hover:underline text-base"
          >
            Retour à l&apos;accueil
          </Link>
        </div>

      </div>
    </main>
  )
}
