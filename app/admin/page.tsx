import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { getSummary } from '@/lib/queries/admin'
import { KpiCard } from '@/components/ui/Card'
import { Callout } from '@/components/ui/Callout'
import { DashboardFilters } from '@/components/admin/DashboardFilters'
import { SatisfactionDistChart } from '@/components/admin/SatisfactionDistChart'
import { ObstaclesChart } from '@/components/admin/ObstaclesChart'
import { ImprovementsChart } from '@/components/admin/ImprovementsChart'
import { AiPerceptionChart } from '@/components/admin/AiPerceptionChart'
import { ResponsesOverTimeChart } from '@/components/admin/ResponsesOverTimeChart'
import { Suspense } from 'react'
import { formatDistanceToNow } from 'date-fns'
import { fr } from 'date-fns/locale'

interface PageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

function mostCommonScore(dist: Record<1 | 2 | 3 | 4 | 5, number>): string {
  let best: number | null = null
  let bestCount = -1
  for (const k of [1, 2, 3, 4, 5] as const) {
    if (dist[k] > bestCount) { bestCount = dist[k]; best = k }
  }
  return best !== null && bestCount > 0 ? String(best) : '—'
}

export default async function AdminDashboard({ searchParams }: PageProps) {
  const session = await auth()
  if (!session) redirect('/admin/login')

  const params = await searchParams
  const filters = {
    from:        params.from        ? new Date(String(params.from))        : undefined,
    to:          params.to          ? new Date(String(params.to))          : undefined,
    workContext: params.workContext ? String(params.workContext)            : undefined,
  }

  let summary
  let smallGroup = false
  try {
    summary = await getSummary(filters)
  } catch (err) {
    if (err instanceof Error && err.message === 'SMALL_GROUP') {
      smallGroup = true
    } else {
      throw err
    }
  }

  return (
    <main className="p-xl flex flex-col gap-xl">
      <div className="flex items-center justify-between">
        <h1 className="font-display font-bold text-primary-dark text-2xl">Tableau de bord</h1>
      </div>

      <Suspense>
        <DashboardFilters />
      </Suspense>

      {smallGroup && (
        <Callout variant="warning">
          Le filtre par contexte de travail retourne moins de 5 réponses. Les données sont masquées pour protéger l&apos;anonymat.
        </Callout>
      )}

      {!smallGroup && summary && (
        <>
          {/* KPI row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-md">
            <KpiCard
              label="Réponses reçues"
              value={summary.totalResponses}
              accented
            />
            <KpiCard
              label="Satisfaction moyenne"
              value={summary.averageSatisfaction != null ? summary.averageSatisfaction.toFixed(1) : '—'}
              sub="sur 5"
              accented
            />
            <KpiCard
              label="Note la plus fréquente"
              value={mostCommonScore(summary.satisfactionDistribution)}
              sub="sur 5"
              accented
            />
            <KpiCard
              label="Dernière réponse"
              value={summary.lastResponseAt
                ? formatDistanceToNow(new Date(summary.lastResponseAt), { addSuffix: true, locale: fr })
                : '—'}
              accented
            />
          </div>

          {/* Charts row 1 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-md">
            <section className="bg-white border border-border rounded-lg shadow-sm p-lg">
              <h2 className="font-display font-bold text-primary-dark text-base mb-md">
                Distribution de la satisfaction
              </h2>
              <SatisfactionDistChart data={summary.satisfactionDistribution} />
            </section>

            <section className="bg-white border border-border rounded-lg shadow-sm p-lg">
              <h2 className="font-display font-bold text-primary-dark text-base mb-md">
                Réponses au fil du temps (90 jours)
              </h2>
              {summary.responsesByDay.length > 0
                ? <ResponsesOverTimeChart data={summary.responsesByDay} />
                : <p className="text-gray-text text-sm">Aucune donnée sur la période.</p>
              }
            </section>
          </div>

          {/* Charts row 2 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-md">
            <section className="bg-white border border-border rounded-lg shadow-sm p-lg">
              <h2 className="font-display font-bold text-primary-dark text-base mb-md">
                Principaux obstacles
              </h2>
              {Object.keys(summary.obstaclesCounts).length > 0
                ? <ObstaclesChart data={summary.obstaclesCounts} />
                : <p className="text-gray-text text-sm">Aucune donnée disponible.</p>
              }
            </section>

            <section className="bg-white border border-border rounded-lg shadow-sm p-lg">
              <h2 className="font-display font-bold text-primary-dark text-base mb-md">
                Améliorations souhaitées
              </h2>
              {Object.keys(summary.improvementsCounts).length > 0
                ? <ImprovementsChart data={summary.improvementsCounts} />
                : <p className="text-gray-text text-sm">Aucune donnée disponible.</p>
              }
            </section>
          </div>

          {/* Charts row 3 */}
          <section className="bg-white border border-border rounded-lg shadow-sm p-lg">
            <h2 className="font-display font-bold text-primary-dark text-base mb-md">
              Perception de l&apos;intelligence artificielle
            </h2>
            {Object.keys(summary.aiPerceptionCounts).length > 0
              ? <AiPerceptionChart data={summary.aiPerceptionCounts} />
              : <p className="text-gray-text text-sm">Aucune donnée disponible.</p>
            }
          </section>
        </>
      )}
    </main>
  )
}
