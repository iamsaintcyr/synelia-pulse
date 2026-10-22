import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { getResponses, type AdminFilters } from '@/lib/queries/admin'

export async function GET(req: Request) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const page  = Math.max(1, Number(searchParams.get('page')  ?? 1))
  const limit = Math.min(100, Math.max(1, Number(searchParams.get('limit') ?? 20)))

  const filters: AdminFilters = {}
  const from = searchParams.get('from')
  const to   = searchParams.get('to')
  const wc   = searchParams.get('workContext')
  if (from) filters.from = new Date(from)
  if (to)   filters.to   = new Date(to)
  if (wc)   filters.workContext = wc

  try {
    const { data, total } = await getResponses({ ...filters, page, limit })
    return NextResponse.json({
      data,
      total,
      page,
      pageSize: limit,
      totalPages: Math.ceil(total / limit),
    })
  } catch (err) {
    if (err instanceof Error && err.message === 'SMALL_GROUP') {
      return NextResponse.json({ error: 'filter_too_narrow' }, { status: 422 })
    }
    console.error('[admin/reponses]', (err as Error).message)
    return NextResponse.json({ error: 'server_error' }, { status: 500 })
  }
}
