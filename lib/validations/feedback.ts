import { z } from 'zod'

export const WORK_CONTEXTS        = ['siege', 'regie', 'teletravail', 'autre', 'no_answer'] as const
export const SATISFACTION_TRENDS  = ['amelioration', 'stable', 'degradation', 'nouveau'] as const
export const OBSTACLES            = ['communication', 'visibilite', 'outils', 'support', 'charge',
                                      'formation', 'reconnaissance', 'missions_client', 'aucun', 'autre'] as const
export const IMPROVEMENTS         = ['accompagnement', 'partage_connaissances', 'formations',
                                      'organisation', 'visibilite_missions', 'amelioration_outils',
                                      'reconnaissance', 'echanges_equipes', 'carriere', 'autre'] as const
export const AI_USAGES            = ['regulier', 'occasionnel', 'non'] as const
export const AI_PERCEPTIONS       = ['opportunite', 'formation_souhaitee',
                                      'interrogation', 'preoccupation', 'pas_avis'] as const
export const RETENTION_INTENTS    = ['non', 'peut_etre', 'oui', 'no_answer'] as const

export const feedbackSchema = z.object({
  workContext:        z.enum(WORK_CONTEXTS).optional(),
  satisfactionScore:  z.number().int().min(1).max(5).optional(),
  satisfactionTrend:  z.enum(SATISFACTION_TRENDS).optional(),
  obstacles:          z.array(z.enum(OBSTACLES)).optional(),
  obstacleOther:      z.string().max(500).optional(),
  mainObstacle:       z.enum(OBSTACLES).optional(),
  improvements:       z.array(z.enum(IMPROVEMENTS)).optional(),
  improvementOther:   z.string().max(500).optional(),
  aiUsage:            z.enum(AI_USAGES).optional(),
  aiPerception:       z.array(z.enum(AI_PERCEPTIONS)).optional(),
  enps:               z.number().int().min(0).max(10).optional(),
  retentionIntent:    z.enum(RETENTION_INTENTS).optional(),
  comment:            z.string().max(2000).optional(),
  additionalComment:  z.string().max(2000).optional(),
}).superRefine((data, ctx) => {
  if (data.obstacles?.includes('aucun') && data.obstacles.length > 1) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['obstacles'],
      message: '"Aucun obstacle majeur" ne peut pas être combiné avec d\'autres obstacles.',
    })
  }
  if (data.aiPerception?.includes('pas_avis') && data.aiPerception.length > 1) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['aiPerception'],
      message: '"Je n\'ai pas encore d\'avis" doit être sélectionné seul.',
    })
  }
})

export type FeedbackPayload = z.infer<typeof feedbackSchema>

export const WORK_CONTEXT_LABELS: Record<string, string> = {
  siege:       'Au siège',
  regie:       'En régie',
  teletravail: 'En télétravail',
  autre:       'Autre',
  no_answer:   'Non renseigné',
}

export const SATISFACTION_TREND_LABELS: Record<string, string> = {
  amelioration: 'En amélioration',
  stable:       'Stable',
  degradation:  'En dégradation',
  nouveau:      'Je suis arrivé(e) récemment (< 6 mois)',
}

export const OBSTACLE_LABELS: Record<string, string> = {
  communication:   'Communication et circulation de l\'information',
  visibilite:      'Visibilité sur les missions et projets',
  outils:          'Outils et environnement de travail',
  support:         'Support et accompagnement',
  charge:          'Charge de travail',
  formation:       'Accès à la formation',
  reconnaissance:  'Reconnaissance et feedback',
  missions_client: 'Conditions en mission client',
  aucun:           'Aucun obstacle majeur',
  autre:           'Autre',
}

export const IMPROVEMENT_LABELS: Record<string, string> = {
  accompagnement:        'Accompagnement managérial',
  partage_connaissances: 'Partage de connaissances',
  formations:            'Formations et certifications',
  organisation:          'Organisation et processus',
  visibilite_missions:   'Visibilité sur les missions',
  amelioration_outils:   'Amélioration des outils',
  reconnaissance:        'Reconnaissance et valorisation',
  echanges_equipes:      'Échanges entre équipes',
  carriere:              'Évolution de carrière',
  autre:                 'Autre',
}

export const AI_USAGE_LABELS: Record<string, string> = {
  regulier:     'Oui, régulièrement (plusieurs fois par semaine)',
  occasionnel:  'Oui, occasionnellement (quelques fois par mois)',
  non:          'Non, je n\'utilise pas d\'outils IA au travail',
}

export const AI_PERCEPTION_LABELS: Record<string, string> = {
  opportunite:         'Je la considère comme une opportunité pour ma productivité.',
  formation_souhaitee: 'J\'aimerais être davantage formé(e) à ces outils.',
  interrogation:       'Je m\'interroge sur son impact sur mon métier.',
  preoccupation:       'Je suis préoccupé(e) par certains risques ou limites.',
  pas_avis:            'Je n\'ai pas encore d\'avis.',
}

export const RETENTION_INTENT_LABELS: Record<string, string> = {
  non:       'Non, je compte rester',
  peut_etre: 'Peut-être, cela dépend de l\'évolution',
  oui:       'Oui, j\'y pense sérieusement',
  no_answer: 'Je préfère ne pas répondre',
}
