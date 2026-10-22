import { z } from 'zod'

export const WORK_CONTEXTS   = ['siege', 'regie', 'teletravail', 'autre', 'no_answer'] as const
export const OBSTACLES       = ['communication', 'visibilite', 'outils', 'support', 'charge',
                                 'formation', 'reconnaissance', 'missions_client', 'aucun', 'autre'] as const
export const IMPROVEMENTS    = ['accompagnement', 'partage_connaissances', 'formations',
                                 'organisation', 'visibilite_missions', 'amelioration_outils',
                                 'reconnaissance', 'echanges_equipes', 'carriere', 'autre'] as const
export const AI_PERCEPTIONS  = ['opportunite', 'utilise_deja', 'formation_souhaitee',
                                 'interrogation', 'preoccupation', 'pas_avis'] as const

export const feedbackSchema = z.object({
  workContext:       z.enum(WORK_CONTEXTS).optional(),
  satisfactionScore: z.number().int().min(1).max(5).optional(),
  obstacles:         z.array(z.enum(OBSTACLES)).optional(),
  obstacleOther:     z.string().max(500).optional(),
  improvements:      z.array(z.enum(IMPROVEMENTS)).optional(),
  improvementOther:  z.string().max(500).optional(),
  aiPerception:      z.array(z.enum(AI_PERCEPTIONS)).optional(),
  comment:           z.string().max(2000).optional(),
  additionalComment: z.string().max(2000).optional(),
}).superRefine((data, ctx) => {
  if (data.obstacles && data.obstacles.includes('aucun') && data.obstacles.length > 1) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['obstacles'],
      message: '"Aucun obstacle majeur" ne peut pas être combiné avec d\'autres obstacles.',
    })
  }
  if (data.aiPerception && data.aiPerception.includes('pas_avis') && data.aiPerception.length > 1) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['aiPerception'],
      message: '"Je n\'ai pas encore d\'avis" doit être sélectionné seul.',
    })
  }
})

export type FeedbackPayload = z.infer<typeof feedbackSchema>
