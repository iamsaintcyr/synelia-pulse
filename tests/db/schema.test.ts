import { feedbackResponses } from '@/lib/db/schema'
import { describe, it, expect } from 'vitest'

describe('feedbackResponses schema', () => {
  it('has id as uuid primary key', () => {
    expect(feedbackResponses.id.primary).toBe(true)
  })
  it('has no email or ip column', () => {
    const cols = Object.keys(feedbackResponses)
    expect(cols).not.toContain('email')
    expect(cols).not.toContain('ip')
    expect(cols).not.toContain('userId')
  })
  it('has all required columns', () => {
    const cols = Object.keys(feedbackResponses)
    expect(cols).toContain('submittedAt')
    expect(cols).toContain('satisfactionScore')
    expect(cols).toContain('obstacles')
    expect(cols).toContain('comment')
  })
})
