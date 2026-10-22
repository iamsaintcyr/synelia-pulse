'use client'

import { useEffect } from 'react'
import { X } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { WORK_CONTEXT_LABELS, OBSTACLE_LABELS, IMPROVEMENT_LABELS, AI_PERCEPTION_LABELS } from '@/lib/validations/feedback'
import type { ResponseRow } from '@/lib/queries/admin'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

interface Props {
  response: ResponseRow | null
  onClose:  () => void
}

function scoreVariant(score: number | null): 'success' | 'neutral' | 'error' {
  if (score == null) return 'neutral'
  if (score >= 4) return 'success'
  if (score === 3) return 'neutral'
  return 'error'
}

export function ResponseDetail({ response, onClose }: Props) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  if (!response) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-ink/30 z-40"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <aside
        className="fixed right-0 top-0 h-full w-full max-w-[520px] bg-white shadow-lg z-50 overflow-y-auto flex flex-col"
        role="dialog"
        aria-modal="true"
        aria-label="Détail de la réponse"
      >
        <header className="flex items-center justify-between px-lg py-md border-b border-border sticky top-0 bg-white">
          <h2 className="font-display font-bold text-primary-dark text-lg">Détail de la réponse</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-text hover:text-ink transition-colors rounded-md p-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            aria-label="Fermer"
          >
            <X size={20} />
          </button>
        </header>

        <div className="flex flex-col gap-md p-lg">
          <div className="flex flex-wrap gap-sm text-sm text-gray-text">
            <span>{format(new Date(response.submittedAt), 'dd/MM/yyyy HH:mm', { locale: fr })}</span>
            {response.workContext && (
              <Badge variant="neutral">{WORK_CONTEXT_LABELS[response.workContext] ?? response.workContext}</Badge>
            )}
            {response.satisfactionScore != null && (
              <Badge variant={scoreVariant(response.satisfactionScore)}>
                Note : {response.satisfactionScore}/5
              </Badge>
            )}
          </div>

          {response.obstacles.length > 0 && (
            <Card>
              <p className="text-xs font-display font-bold text-slate uppercase tracking-wide mb-sm">Obstacles</p>
              <div className="flex flex-wrap gap-xs">
                {response.obstacles.map(o => (
                  <Badge key={o} variant="neutral">{OBSTACLE_LABELS[o] ?? o}</Badge>
                ))}
              </div>
            </Card>
          )}

          {response.improvements.length > 0 && (
            <Card>
              <p className="text-xs font-display font-bold text-slate uppercase tracking-wide mb-sm">Améliorations</p>
              <div className="flex flex-wrap gap-xs">
                {response.improvements.map(i => (
                  <Badge key={i} variant="info">{IMPROVEMENT_LABELS[i] ?? i}</Badge>
                ))}
              </div>
            </Card>
          )}

          {response.aiPerception.length > 0 && (
            <Card>
              <p className="text-xs font-display font-bold text-slate uppercase tracking-wide mb-sm">Perception IA</p>
              <div className="flex flex-wrap gap-xs">
                {response.aiPerception.map(a => (
                  <Badge key={a} variant="info">{AI_PERCEPTION_LABELS[a] ?? a}</Badge>
                ))}
              </div>
            </Card>
          )}

          {response.comment && (
            <Card>
              <p className="text-xs font-display font-bold text-slate uppercase tracking-wide mb-sm">
                Si vous pouviez changer une seule chose…
              </p>
              <p className="text-ink text-sm whitespace-pre-wrap">{response.comment}</p>
            </Card>
          )}

          {response.additionalComment && (
            <Card>
              <p className="text-xs font-display font-bold text-slate uppercase tracking-wide mb-sm">
                Commentaire additionnel
              </p>
              <p className="text-ink text-sm whitespace-pre-wrap">{response.additionalComment}</p>
            </Card>
          )}

          {!response.obstacles.length && !response.improvements.length && !response.aiPerception.length &&
            !response.comment && !response.additionalComment && response.satisfactionScore == null && (
            <p className="text-gray-text text-sm text-center py-lg">Réponse vide — aucun champ renseigné.</p>
          )}
        </div>
      </aside>
    </>
  )
}
