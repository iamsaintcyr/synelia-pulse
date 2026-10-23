import { NextResponse } from 'next/server'
import { z } from 'zod'
import { auth } from '@/lib/auth'
import { getSummary, type AdminFilters } from '@/lib/queries/admin'

const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/)

export async function GET(req: Request) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const filters: AdminFilters = {}

  const from = searchParams.get('from')
  const to   = searchParams.get('to')
  const wc   = searchParams.get('workContext')

  if (from) {
    if (!isoDate.safeParse(from).success) return NextResponse.json({ error: 'invalid_date' }, { status: 400 })
    filters.from = new Date(from)
  }
  if (to) {
    if (!isoDate.safeParse(to).success) return NextResponse.json({ error: 'invalid_date' }, { status: 400 })
    filters.to = new Date(to)
  }
  if (wc) filters.workContext = wc

  try {
    const data = await getSummary(filters)
    return NextResponse.json(data)
  } catch (err) {
    if (err instanceof Error && err.message === 'SMALL_GROUP') {
      return NextResponse.json({ error: 'filter_too_narrow' }, { status: 422 })
    }
    console.error('[admin/summary]', (err as Error).message)
    return NextResponse.json({ error: 'server_error' }, { status: 500 })
  }
}
