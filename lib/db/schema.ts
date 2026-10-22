import { pgTable, uuid, timestamp, varchar, integer, text } from 'drizzle-orm/pg-core'

export const feedbackResponses = pgTable('feedback_responses', {
  id:                uuid('id').defaultRandom().primaryKey(),
  submittedAt:       timestamp('submitted_at', { withTimezone: true }).defaultNow().notNull(),
  workContext:       varchar('work_context', { length: 50 }),
  satisfactionScore: integer('satisfaction_score'),
  obstacles:         text('obstacles').array(),
  obstacleOther:     text('obstacle_other'),
  improvements:      text('improvements').array(),
  improvementOther:  text('improvement_other'),
  aiPerception:      text('ai_perception').array(),
  comment:           text('comment'),
  additionalComment: text('additional_comment'),
})
