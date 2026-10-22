import { db } from '@/lib/db'
import { feedbackResponses } from '@/lib/db/schema'
import type { FeedbackPayload } from '@/lib/validations/feedback'

export async function insertFeedback(data: FeedbackPayload): Promise<void> {
  await db.insert(feedbackResponses).values({
    workContext:       data.workContext,
    satisfactionScore: data.satisfactionScore,
    obstacles:         data.obstacles,
    obstacleOther:     data.obstacleOther,
    improvements:      data.improvements,
    improvementOther:  data.improvementOther,
    aiPerception:      data.aiPerception,
    comment:           data.comment,
    additionalComment: data.additionalComment,
  })
}
