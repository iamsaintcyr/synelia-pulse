import { db } from '@/lib/db/index'
import { feedbackResponses } from '@/lib/db/schema'
import { sql, and, gte, lte, eq, count } from 'drizzle-orm'

export type AdminFilters = {
  from?:        Date
  to?:          Date
  workContext?: string
}

export type SummaryResponse = {
  totalResponses:           number
  averageSatisfaction:      number | null
  satisfactionDistribution: Record<1 | 2 | 3 | 4 | 5, number>
  obstaclesCounts:          Record<string, number>
  improvementsCounts:       Record<string, number>
  aiPerceptionCounts:       Record<string, number>
  responsesByDay:           Array<{ date: string; count: number }>
  lastResponseAt:           string | null
}

export type ResponseRow = {
  id:                string
  submittedAt:       string
  workContext:       string | null
  satisfactionScore: number | null
  obstacles:         string[]
  improvements:      string[]
  aiPerception:      string[]
  comment:           string | null
  additionalComment: string | null
}

export function sanitizeCsvCell(value: string | null | undefined): string {
  if (value == null) return ''
  const str = String(value)
  if (/^[=+\-@\t\r]/.test(str)) return `'${str}`
  return str
}

function buildWhereConditions(filters: AdminFilters) {
  const conditions = []
  if (filters.from) conditions.push(gte(feedbackResponses.submittedAt, filters.from))
  if (filters.to)   conditions.push(lte(feedbackResponses.submittedAt, filters.to))
  if (filters.workContext) conditions.push(eq(feedbackResponses.workContext, filters.workContext))
  return conditions.length > 0 ? and(...conditions) : undefined
}

function tallyCounts(rows: Array<{ values: string[] | null }>): Record<string, number> {
  const counts: Record<string, number> = {}
  for (const row of rows) {
    for (const v of row.values ?? []) {
      counts[v] = (counts[v] ?? 0) + 1
    }
  }
  return counts
}

export async function getSummary(filters: AdminFilters): Promise<SummaryResponse> {
  const where = buildWhereConditions(filters)

  const rows = await db
    .select({
      satisfactionScore: feedbackResponses.satisfactionScore,
      obstacles:         feedbackResponses.obstacles,
      improvements:      feedbackResponses.improvements,
      aiPerception:      feedbackResponses.aiPerception,
      submittedAt:       feedbackResponses.submittedAt,
    })
    .from(feedbackResponses)
    .where(where)

  if (filters.workContext && rows.length < 5) {
    throw new Error('SMALL_GROUP')
  }

  const totalResponses = rows.length

  const scored = rows.filter(r => r.satisfactionScore != null)
  const averageSatisfaction = scored.length > 0
    ? scored.reduce((sum, r) => sum + r.satisfactionScore!, 0) / scored.length
    : null

  const satisfactionDistribution: Record<1 | 2 | 3 | 4 | 5, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
  for (const r of rows) {
    if (r.satisfactionScore && r.satisfactionScore >= 1 && r.satisfactionScore <= 5) {
      satisfactionDistribution[r.satisfactionScore as 1 | 2 | 3 | 4 | 5]++
    }
  }

  const obstaclesCounts   = tallyCounts(rows.map(r => ({ values: r.obstacles })))
  const improvementsCounts = tallyCounts(rows.map(r => ({ values: r.improvements })))
  const aiPerceptionCounts = tallyCounts(rows.map(r => ({ values: r.aiPerception })))

  // Responses by day — last 90 days
  const ninetyDaysAgo = new Date()
  ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90)
  const dayMap: Record<string, number> = {}
  for (const r of rows) {
    if (r.submittedAt >= ninetyDaysAgo) {
      const date = r.submittedAt.toISOString().slice(0, 10)
      dayMap[date] = (dayMap[date] ?? 0) + 1
    }
  }
  const responsesByDay = Object.entries(dayMap)
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => a.date.localeCompare(b.date))

  const lastResponseAt = rows.length > 0
    ? rows.reduce((latest, r) => r.submittedAt > latest ? r.submittedAt : latest, rows[0].submittedAt).toISOString()
    : null

  return {
    totalResponses,
    averageSatisfaction,
    satisfactionDistribution,
    obstaclesCounts,
    improvementsCounts,
    aiPerceptionCounts,
    responsesByDay,
    lastResponseAt,
  }
}

export async function getResponses(
  filters: AdminFilters & { page: number; limit: number }
): Promise<{ data: ResponseRow[]; total: number }> {
  const { page, limit, ...rest } = filters
  const where = buildWhereConditions(rest)
  const offset = (page - 1) * limit

  const [rows, totalResult] = await Promise.all([
    db.select().from(feedbackResponses).where(where).limit(limit).offset(offset)
      .orderBy(sql`${feedbackResponses.submittedAt} DESC`),
    db.select({ count: count() }).from(feedbackResponses).where(where),
  ])

  const total = Number(totalResult[0]?.count ?? 0)

  if (rest.workContext && total < 5) {
    throw new Error('SMALL_GROUP')
  }

  const data: ResponseRow[] = rows.map(r => ({
    id:                r.id,
    submittedAt:       r.submittedAt.toISOString(),
    workContext:       r.workContext ?? null,
    satisfactionScore: r.satisfactionScore ?? null,
    obstacles:         r.obstacles ?? [],
    improvements:      r.improvements ?? [],
    aiPerception:      r.aiPerception ?? [],
    comment:           r.comment ?? null,
    additionalComment: r.additionalComment ?? null,
  }))

  return { data, total }
}

export async function getExportData(filters: AdminFilters): Promise<ResponseRow[]> {
  const where = buildWhereConditions(filters)

  const rows = await db.select().from(feedbackResponses).where(where)
    .orderBy(sql`${feedbackResponses.submittedAt} DESC`)

  return rows.map(r => ({
    id:                r.id,
    submittedAt:       r.submittedAt.toISOString(),
    workContext:       r.workContext ?? null,
    satisfactionScore: r.satisfactionScore ?? null,
    obstacles:         r.obstacles ?? [],
    improvements:      r.improvements ?? [],
    aiPerception:      r.aiPerception ?? [],
    comment:           r.comment ?? null,
    additionalComment: r.additionalComment ?? null,
  }))
}
