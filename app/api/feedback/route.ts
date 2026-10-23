import { NextResponse } from 'next/server'
import { feedbackSchema } from '@/lib/validations/feedback'
import { insertFeedback } from '@/lib/queries/feedback'
import { feedbackLimiter } from '@/lib/rateLimit'
import { createHash } from 'crypto'

function clientKey(request: Request): string {
  // Hash the forwarded IP — never stored in DB, only used as a rate-limit key.
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
           ?? request.headers.get('x-real-ip')
           ?? 'unknown'
  return createHash('sha256').update(ip).digest('hex').slice(0, 16)
}

export async function POST(request: Request) {
  if (!feedbackLimiter(clientKey(request))) {
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
