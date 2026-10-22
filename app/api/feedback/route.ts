import { NextResponse } from 'next/server'
import { feedbackSchema } from '@/lib/validations/feedback'
import { insertFeedback } from '@/lib/queries/feedback'

// In-memory rate limiter: max 50 requests per 60-second window.
// This is intentionally keyed on a single 'global' token — not by IP —
// to avoid storing any identifying data. Replace with Vercel KV in production
// for persistence across serverless instances.
const RATE_LIMIT_WINDOW_MS = 60_000
const RATE_LIMIT_MAX = 50
const windowTimestamps: number[] = []

function isRateLimited(): boolean {
  const now = Date.now()
  const windowStart = now - RATE_LIMIT_WINDOW_MS
  while (windowTimestamps.length > 0 && windowTimestamps[0] < windowStart) {
    windowTimestamps.shift()
  }
  if (windowTimestamps.length >= RATE_LIMIT_MAX) {
    return true
  }
  windowTimestamps.push(now)
  return false
}

export async function POST(request: Request) {
  if (isRateLimited()) {
    return NextResponse.json({ error: 'too_many_requests' }, { status: 429 })
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'invalid_json' }, { status: 400 })
  }

  const result = feedbackSchema.safeParse(body)
  if (!result.success) {
    return NextResponse.json(
      { error: result.error.issues[0]?.message ?? 'validation_error' },
      { status: 400 },
    )
  }

  try {
    await insertFeedback(result.data)
  } catch (err) {
    const code = (err as { code?: string }).code ?? 'unknown'
    console.error('[feedback] db error code:', code)
    return NextResponse.json({ error: 'server_error' }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
