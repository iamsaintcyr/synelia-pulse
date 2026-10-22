import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Callout } from '@/components/ui/Callout'

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gray-light py-3xl px-md">
      <div className="max-w-[560px] mx-auto flex flex-col gap-xl">

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo-couleur.png" alt="Synelia" className="h-10 w-auto self-start" />

        <div className="bg-white rounded-lg shadow-sm border border-border overflow-hidden">

          <div className="h-[3px] bg-accent" />

          <div className="p-lg flex flex-col gap-lg">

            <h1
              className="font-display font-bold text-primary-dark"
              style={{ fontSize: 'clamp(1.75rem, 4vw, 2.25rem)', lineHeight: 1.15 }}
            >
              Votre avis compte
            </h1>

            <p className="font-body text-ink" style={{ fontSize: '1rem', lineHeight: 1.6, maxWidth: '58ch' }}>
              Dans une démarche d&apos;amélioration continue, le Pôle Développement souhaite
              recueillir vos retours sur votre expérience — difficultés rencontrées et
              améliorations souhaitées. Que vous travailliez au siège, en régie ou à distance,
              votre contribution compte.
            </p>

            <Callout variant="info">
              <p className="font-bold mb-xs">Ce questionnaire est anonyme.</p>
              <p>
                Ne renseignez pas votre nom, votre adresse e-mail, le nom d&apos;un client
                ni aucune information permettant de vous identifier ou d&apos;identifier une
                autre personne. Vos réponses seront analysées de manière collective afin de
                définir des actions d&apos;amélioration concrètes.
              </p>
            </Callout>

            <div className="flex flex-col gap-sm pt-xs">
              <Link
                href="/survey"
                className="inline-flex items-center gap-sm self-start font-display font-bold rounded-md transition-all duration-150 bg-accent text-white hover:bg-[#096463] hover:-translate-y-px active:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary-dark px-6 py-3 text-base"
              >
                Donner mon avis
                <ArrowRight size={18} aria-hidden="true" />
              </Link>
              <p className="font-body text-gray-text" style={{ fontSize: '0.75rem', lineHeight: 1.4 }}>
                Temps estimé : 3 minutes · Toutes les questions sont facultatives.
              </p>
            </div>

          </div>
        </div>

      </div>
    </main>
  )
}
