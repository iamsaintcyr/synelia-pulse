'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, ChevronLeft } from 'lucide-react'
import { cn } from '@/lib/utils'
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
  { value: 'communication',   label: 'Communication et circulation de l\'information' },
  { value: 'visibilite',      label: 'Manque de visibilité sur les projets et les priorités' },
  { value: 'outils',          label: 'Difficultés liées aux outils ou à l\'environnement technique' },
  { value: 'support',         label: 'Difficulté à obtenir du support ou de l\'aide' },
  { value: 'charge',          label: 'Charge de travail ou répartition des tâches' },
  { value: 'formation',       label: 'Manque de formation ou d\'accompagnement' },
  { value: 'reconnaissance',  label: 'Manque de reconnaissance' },
  { value: 'missions_client', label: 'Difficultés liées à l\'organisation des missions chez les clients' },
  { value: 'aucun',           label: 'Aucun obstacle majeur' },
  { value: 'autre',           label: 'Autre' },
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
  { value: 'opportunite',         label: 'Je la considère comme une opportunité pour améliorer ma productivité.' },
  { value: 'utilise_deja',        label: "J'utilise déjà des outils d'IA dans mon travail." },
  { value: 'formation_souhaitee', label: "J'aimerais être davantage formé à ces outils." },
  { value: 'interrogation',       label: "Je m'interroge sur son impact sur mon métier." },
  { value: 'preoccupation',       label: 'Je suis préoccupé par certains risques ou limites.' },
  { value: 'pas_avis',            label: "Je n'ai pas encore d'avis." },
]

type FormState = FeedbackPayload & { obstacleOther: string; improvementOther: string }

const TOTAL_STEPS = 7

export default function SurveyPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [visible, setVisible] = useState(true)
  const [transitioning, setTransitioning] = useState(false)
  const [form, setForm] = useState<FormState>({ obstacleOther: '', improvementOther: '' })
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  function navigate(target: number) {
    if (transitioning) return
    setTransitioning(true)
    setVisible(false)
    setTimeout(() => {
      setStep(target)
      setVisible(true)
      setTransitioning(false)
    }, 160)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!isLast || submitting) return
    setSubmitting(true)
    setSubmitError(null)
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
      setSubmitError('Une erreur est survenue. Veuillez réessayer.')
      setSubmitting(false)
    }
  }

  const isLast = step === TOTAL_STEPS
  const progress = Math.round((step / TOTAL_STEPS) * 100)

  return (
    <main className="min-h-screen bg-gray-light py-3xl px-md">
      <div className="max-w-[600px] mx-auto flex flex-col gap-xl">

        <header className="flex flex-col gap-xs">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo-couleur.png" alt="Synelia" className="h-10 w-auto self-start" />
          <h1 className="font-display font-bold text-primary-dark" style={{ fontSize: 'clamp(1.25rem, 2.5vw, 1.5rem)', lineHeight: 1.2 }}>
            Enquête de satisfaction
          </h1>
        </header>

        <form onSubmit={handleSubmit} noValidate>
          <div className="bg-white rounded-lg shadow-sm border border-border overflow-hidden">

            {/* Progress bar */}
            <div className="h-[3px] bg-gray-light" role="none">
              <div
                className="h-full bg-accent transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
                role="progressbar"
                aria-valuenow={step}
                aria-valuemin={1}
                aria-valuemax={TOTAL_STEPS}
                aria-label={`Étape ${step} sur ${TOTAL_STEPS}`}
              />
            </div>

            {/* Step counter */}
            <div className="px-lg pt-md">
              <span className="font-body text-[0.75rem] leading-[1.4] text-gray-text" aria-hidden="true">
                <span className="hidden sm:inline">Étape {step} sur {TOTAL_STEPS}</span>
                <span className="sm:hidden">{step} / {TOTAL_STEPS}</span>
              </span>
            </div>

            {/* Step content */}
            <div
              className={cn(
                'px-lg pt-md pb-lg transition-opacity duration-[160ms] ease-out',
                visible ? 'opacity-100' : 'opacity-0',
              )}
            >
              {step === 1 && (
                <div className="flex flex-col gap-lg">
                  <Callout variant="info">
                    Ce questionnaire est anonyme. Ne renseignez pas votre nom, votre adresse
                    e-mail, le nom d&apos;un client ni aucune information permettant de vous
                    identifier.
                  </Callout>
                  <SingleChoice
                    name="workContext"
                    label="Dans quel contexte travaillez-vous principalement ?"
                    options={WORK_CONTEXT_OPTIONS}
                    value={form.workContext}
                    onChange={(v) => set('workContext', v as FeedbackPayload['workContext'])}
                  />
                </div>
              )}

              {step === 2 && (
                <div className="flex flex-col gap-md">
                  <p
                    className="font-display font-bold text-primary-dark"
                    style={{ fontSize: '1.125rem', lineHeight: 1.25 }}
                  >
                    Globalement, comment évaluez-vous votre expérience actuelle au sein du
                    Pôle Développement ?
                  </p>
                  <RatingScale
                    value={form.satisfactionScore ?? null}
                    onChange={(v) => set('satisfactionScore', v)}
                  />
                </div>
              )}

              {step === 3 && (
                <div className="flex flex-col gap-lg">
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
                      value={form.obstacleOther}
                      onChange={(v) => set('obstacleOther', v)}
                      maxLength={500}
                    />
                  )}
                </div>
              )}

              {step === 4 && (
                <div className="flex flex-col gap-lg">
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
                      value={form.improvementOther}
                      onChange={(v) => set('improvementOther', v)}
                      maxLength={500}
                    />
                  )}
                </div>
              )}

              {step === 5 && (
                <MultiChoice
                  name="aiPerception"
                  label="Comment percevez-vous l'utilisation de l'intelligence artificielle dans votre travail de développeur ?"
                  options={AI_PERCEPTION_OPTIONS}
                  value={form.aiPerception ?? []}
                  onChange={(v) => set('aiPerception', v as FeedbackPayload['aiPerception'])}
                  exclusiveValues={['pas_avis']}
                />
              )}

              {step === 6 && (
                <TextQuestion
                  name="comment"
                  label="Si vous pouviez changer une seule chose au sein du Pôle Développement, laquelle serait-ce ?"
                  value={form.comment ?? ''}
                  onChange={(v) => set('comment', v)}
                  hint="Partagez une idée, une proposition ou un problème que vous aimeriez voir traité. Évitez de citer des personnes, des clients ou des informations confidentielles."
                  maxLength={2000}
                />
              )}

              {step === 7 && (
                <div className="flex flex-col gap-lg">
                  <TextQuestion
                    name="additionalComment"
                    label="Souhaitez-vous ajouter un autre commentaire ou une suggestion ?"
                    value={form.additionalComment ?? ''}
                    onChange={(v) => set('additionalComment', v)}
                    hint="Cette question est facultative."
                    maxLength={2000}
                  />
                  {submitError && (
                    <Callout variant="error">{submitError}</Callout>
                  )}
                </div>
              )}
            </div>

            {/* Navigation */}
            <div className="px-lg pb-lg pt-lg flex items-center justify-between border-t border-border">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={() => navigate(step - 1)}
                  disabled={transitioning}
                  className={cn(
                    'flex items-center gap-xs font-body font-semibold text-[0.9375rem] text-slate',
                    'hover:text-primary-dark transition-colors duration-150',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 rounded-sm',
                    'disabled:opacity-40 disabled:cursor-not-allowed',
                  )}
                >
                  <ChevronLeft size={16} aria-hidden="true" />
                  Précédent
                </button>
              ) : (
                <div aria-hidden="true" />
              )}

              {isLast ? (
                <Button type="submit" variant="accent" disabled={submitting}>
                  {submitting ? (
                    <span className="flex items-center gap-sm">
                      <Loader2 className="animate-spin" size={16} aria-hidden="true" />
                      Envoi en cours…
                    </span>
                  ) : (
                    'Envoyer mes réponses'
                  )}
                </Button>
              ) : (
                <Button
                  type="button"
                  variant="accent"
                  onClick={() => navigate(step + 1)}
                  disabled={transitioning}
                >
                  Suivant
                </Button>
              )}
            </div>

          </div>
        </form>

      </div>
    </main>
  )
}
