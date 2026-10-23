import { pgTable, uuid, timestamp, varchar, integer, text } from 'drizzle-orm/pg-core'

export const feedbackResponses = pgTable('feedback_responses', {
  id:                  uuid('id').defaultRandom().primaryKey(),
  submittedAt:         timestamp('submitted_at', { withTimezone: true }).defaultNow().notNull(),
  workContext:         varchar('work_context', { length: 50 }),
  satisfactionScore:   integer('satisfaction_score'),
  satisfactionTrend:   varchar('satisfaction_trend', { length: 50 }),
  obstacles:           text('obstacles').array(),
  obstacleOther:       text('obstacle_other'),
  mainObstacle:        varchar('main_obstacle', { length: 100 }),
  improvements:        text('improvements').array(),
  improvementOther:    text('improvement_other'),
  aiUsage:             varchar('ai_usage', { length: 50 }),
  aiPerception:        text('ai_perception').array(),
  enps:                integer('enps'),
  retentionIntent:     varchar('retention_intent', { length: 50 }),
  comment:             text('comment'),
  additionalComment:   text('additional_comment'),  // kept for historical data; removed from form
})
