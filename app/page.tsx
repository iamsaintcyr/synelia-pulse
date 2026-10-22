import Image from 'next/image'
import Link from 'next/link'
import { Callout } from '@/components/ui/Callout'

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gray-light py-3xl px-md">
      <div className="max-w-[720px] mx-auto flex flex-col gap-2xl">

        <header className="flex flex-col gap-md">
          <Image
            src="/logo-couleur.png"
            alt="Synelia"
            width={160}
            height={48}
            className="h-10 w-auto"
            priority
          />
          <h1 className="font-display font-bold text-primary-dark text-4xl leading-tight">
            Votre avis compte
          </h1>
        </header>

        <p className="text-ink text-base leading-relaxed">
          Dans une démarche d&apos;amélioration continue, le Pôle Développement souhaite recueillir
          vos retours sur votre expérience, les difficultés que vous rencontrez et les améliorations
          que vous aimeriez voir mises en place.
        </p>

        <p className="text-ink text-base leading-relaxed">
          Que vous travailliez au siège, en régie chez un client ou à distance, votre contribution
          est importante.
        </p>

        <Callout variant="info">
          <p className="font-bold mb-xs">Ce questionnaire est anonyme.</p>
          <p>
            Ne renseignez pas votre nom, votre adresse e-mail, le nom d&apos;un client ni aucune
            information permettant de vous identifier ou d&apos;identifier une autre personne.
            Vos réponses seront analysées de manière collective afin de définir des actions
            d&apos;amélioration concrètes.
          </p>
        </Callout>

        <div className="flex flex-col gap-md items-start">
          <Link
            href="/survey"
            className="inline-flex items-center font-display font-bold rounded-md transition-all duration-150 bg-accent text-white hover:bg-[#096463] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary-dark px-6 py-3 text-base"
          >
            Donner mon avis
          </Link>
          <p className="text-sm text-gray-text">
            Temps estimé : 3 minutes.
            Les réponses sont facultatives, sauf si une question est explicitement rendue obligatoire.
          </p>
        </div>

      </div>
    </main>
  )
}
