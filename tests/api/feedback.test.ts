import { describe, it, expect } from 'vitest'
import { feedbackSchema } from '@/lib/validations/feedback'

describe('feedbackSchema', () => {
  it('accepts empty submission', () => {
    expect(feedbackSchema.safeParse({}).success).toBe(true)
  })
  it('rejects satisfactionScore 0', () => {
    expect(feedbackSchema.safeParse({ satisfactionScore: 0 }).success).toBe(false)
  })
  it('rejects satisfactionScore 6', () => {
    expect(feedbackSchema.safeParse({ satisfactionScore: 6 }).success).toBe(false)
  })
  it('rejects aucun + another obstacle', () => {
    const result = feedbackSchema.safeParse({ obstacles: ['aucun', 'communication'] })
    expect(result.success).toBe(false)
  })
  it('rejects pas_avis + another ai perception', () => {
    const result = feedbackSchema.safeParse({ aiPerception: ['pas_avis', 'opportunite'] })
    expect(result.success).toBe(false)
  })
  it('rejects comment over 2000 chars', () => {
    expect(feedbackSchema.safeParse({ comment: 'a'.repeat(2001) }).success).toBe(false)
  })
  it('accepts valid full payload', () => {
    const payload = {
      workContext: 'siege',
      satisfactionScore: 4,
      obstacles: ['communication', 'visibilite'],
      improvements: ['formations'],
      aiPerception: ['opportunite', 'utilise_deja'],
      comment: 'Bonne ambiance',
    }
    expect(feedbackSchema.safeParse(payload).success).toBe(true)
  })
})
