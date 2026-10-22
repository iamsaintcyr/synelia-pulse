'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Callout } from '@/components/ui/Callout'
import { RatingScale } from '@/components/survey/RatingScale'
import { SingleChoice } from '@/components/survey/SingleChoice'
import { MultiChoice } from '@/components/survey/MultiChoice'
import { TextQuestion } from '@/components/survey/TextQuestion'
import type { FeedbackPayload } from '@/lib/validations/feedback'

const WORK_CONTEXT_OPTIONS = [
  { value: 'siege',       label: 'Au siège' },
  { value: 'regie',       label: 'En régie chez un client' },
  { value: 'teletravail', label: 'En télétravail' },
  { value: 'autre',       label: 'Autre' },
  { value: 'no_answer',   label: 'Je préfère ne pas répondre' },
]

const OBSTACLE_OPTIONS = [
  { value: 'communication',    label: 'Communication et circulation de l\'information' },
  { value: 'visibilite',       label: 'Manque de visibilité sur les projets et les priorités' },
  { value: 'outils',           label: 'Difficultés liées aux outils ou à l\'environnement technique' },
  { value: 'support',          label: 'Difficulté à obtenir du support ou de l\'aide' },
  { value: 'charge',           label: 'Charge de travail ou répartition des tâches' },
  { value: 'formation',        label: 'Manque de formation ou d\'accompagnement' },
  { value: 'reconnaissance',   label: 'Manque de reconnaissance' },
  { value: 'missions_client',  label: 'Difficultés liées à l\'organisation des missions chez les clients' },
  { value: 'aucun',            label: 'Aucun obstacle majeur' },
  { value: 'autre',            label: 'Autre' },
]

const IMPROVEMENT_OPTIONS = [
  { value: 'accompagnement',        label: 'Meilleur accompagnement technique' },
  { value: 'partage_connaissances', label: 'Partage de connaissances entre développeurs' },
  { value: 'formations',            label: 'Formations et certifications' },
  { value: 'organisation',          label: 'Meilleure organisation et clarification des priorités' },
  { value: 'visibilite_missions',   label: 'Meilleure visibilité sur les missions et opportunités de projets' },
  { value: 'amelioration_outils',   label: 'Amélioration des outils et des environnements de développement' },
  { value: 'reconnaissance',        label: 'Meilleure reconnaissance du travail accompli' },
  { value: 'echanges_equipes',      label: 'Davantage d\'échanges entre les équipes du siège et celles en régie' },
  { value: 'carriere',              label: 'Meilleur accompagnement de carrière' },
  { value: 'autre',                 label: 'Autre' },
]

const AI_PERCEPTION_OPTIONS = [
  { value: 'opportunite',          label: 'Je la considère comme une opportunité pour améliorer ma productivité.' },
  { value: 'utilise_deja',         label: "J'utilise déjà des outils d'IA dans mon travail." },
  { value: 'formation_souhaitee',  label: "J'aimerais être davantage formé à ces outils." },
  { value: 'interrogation',        label: "Je m'interroge sur son impact sur mon métier." },
  { value: 'preoccupation',        label: 'Je suis préoccupé par certains risques ou limites.' },
  { value: 'pas_avis',             label: "Je n'ai pas encore d'avis." },
]

export default function SurveyPage() {
  const router = useRouter()
  const [form, setForm] = useState<FeedbackPayload & { obstacleOther: string; improvementOther: string }>({
    obstacleOther: '',
    improvementOther: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function set<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (submitting) return
    setSubmitting(true)
    setError(null)

    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error((data as { error?: string }).error ?? 'server_error')
      }
      router.push('/merci')
    } catch {
      setError('Une erreur est survenue. Veuillez réessayer.')
      setSubmitting(false)
    }
  }

  return (
    <main className="min-h-screen bg-gray-light py-3xl px-md">
      <div className="max-w-[720px] mx-auto flex flex-col gap-2xl">

        <header>
          <span className="font-display font-bold text-primary text-sm tracking-widest uppercase">
            Synelia
          </span>
          <h1 className="font-display font-bold text-primary-dark text-3xl mt-sm">
            Enquête de satisfaction
          </h1>
        </header>

        <Callout variant="info">
          Ce questionnaire est anonyme. Ne renseignez pas votre nom, votre adresse e-mail, le nom
          d&apos;un client ni aucune information permettant de vous identifier.
        </Callout>

        <form onSubmit={handleSubmit} className="flex flex-col gap-2xl">

          {/* Q1 — Contexte de travail */}
          <SingleChoice
            name="workContext"
            label="Dans quel contexte travaillez-vous principalement ?"
            options={WORK_CONTEXT_OPTIONS}
            value={form.workContext}
            onChange={(v) => set('workContext', v as FeedbackPayload['workContext'])}
          />

          {/* Q2 — Satisfaction globale */}
          <div className="flex flex-col gap-sm">
            <p className="font-display font-bold text-ink text-base">
              Globalement, comment évaluez-vous votre expérience actuelle au sein du Pôle
              Développement ?
            </p>
            <RatingScale
              value={form.satisfactionScore ?? null}
              onChange={(v) => set('satisfactionScore', v)}
            />
          </div>

          {/* Q3 — Obstacles */}
          <MultiChoice
            name="obstacles"
            label="Quels sont les principaux obstacles que vous rencontrez actuellement dans votre travail ?"
            options={OBSTACLE_OPTIONS}
            value={form.obstacles ?? []}
            onChange={(v) => set('obstacles', v as FeedbackPayload['obstacles'])}
            exclusiveValues={['aucun']}
          />
          {form.obstacles?.includes('autre') && (
            <TextQuestion
              name="obstacleOther"
              label="Précisez votre obstacle"
              value={form.obstacleOther ?? ''}
              onChange={(v) => set('obstacleOther', v)}
              maxLength={500}
            />
          )}

          {/* Q4 — Améliorations */}
          <MultiChoice
            name="improvements"
            label="Quelles améliorations seraient les plus utiles pour vous ?"
            options={IMPROVEMENT_OPTIONS}
            value={form.improvements ?? []}
            onChange={(v) => set('improvements', v as FeedbackPayload['improvements'])}
          />
          {form.improvements?.includes('autre') && (
            <TextQuestion
              name="improvementOther"
              label="Précisez votre amélioration"
              value={form.improvementOther ?? ''}
              onChange={(v) => set('improvementOther', v)}
              maxLength={500}
            />
          )}

          {/* Q5 — Perception IA */}
          <MultiChoice
            name="aiPerception"
            label="Comment percevez-vous l'utilisation de l'intelligence artificielle dans votre travail de développeur ?"
            options={AI_PERCEPTION_OPTIONS}
            value={form.aiPerception ?? []}
            onChange={(v) => set('aiPerception', v as FeedbackPayload['aiPerception'])}
            exclusiveValues={['pas_avis']}
          />

          {/* Q6 — Suggestion libre */}
          <TextQuestion
            name="comment"
            label="Si vous pouviez changer une seule chose au sein du Pôle Développement, laquelle serait-ce ?"
            value={form.comment ?? ''}
            onChange={(v) => set('comment', v)}
            hint="Partagez une idée, une proposition ou un problème que vous aimeriez voir traité. Évitez de citer des personnes, des clients ou des informations confidentielles."
            maxLength={2000}
          />

          {/* Q7 — Commentaire complémentaire */}
          <TextQuestion
            name="additionalComment"
            label="Souhaitez-vous ajouter un autre commentaire ou une suggestion ?"
            value={form.additionalComment ?? ''}
            onChange={(v) => set('additionalComment', v)}
            maxLength={2000}
          />

          {error && (
            <Callout variant="error">{error}</Callout>
          )}

          <div className="flex justify-end pb-2xl">
            <Button variant="accent" type="submit" disabled={submitting}>
              {submitting ? (
                <span className="flex items-center gap-sm">
                  <Loader2 className="animate-spin" size={18} />
                  Envoi en cours…
                </span>
              ) : (
                'Envoyer mes réponses'
              )}
            </Button>
          </div>

        </form>
      </div>
    </main>
  )
}
