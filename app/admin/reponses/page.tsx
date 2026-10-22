import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { getResponses } from '@/lib/queries/admin'
import { ResponsesTable } from '@/components/admin/ResponsesTable'

interface PageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

const PAGE_SIZE = 20

export default async function ReponsesPage({ searchParams }: PageProps) {
  const session = await auth()
  if (!session) redirect('/admin/login')

  const params = await searchParams
  const filters = {
    from:        params.from        ? new Date(String(params.from))  : undefined,
    to:          params.to          ? new Date(String(params.to))    : undefined,
    workContext: params.workContext ? String(params.workContext)      : undefined,
  }

  const { data, total } = await getResponses({ ...filters, page: 1, limit: PAGE_SIZE })

  const exportParams = new URLSearchParams()
  if (filters.from)        exportParams.set('from', filters.from.toISOString().slice(0, 10))
  if (filters.to)          exportParams.set('to', filters.to.toISOString().slice(0, 10))
  if (filters.workContext) exportParams.set('workContext', filters.workContext)

  const csvHref  = `/api/admin/export?format=csv&${exportParams.toString()}`
  const xlsxHref = `/api/admin/export?format=xlsx&${exportParams.toString()}`

  return (
    <main className="p-xl flex flex-col gap-xl">
      <div className="flex flex-wrap items-center justify-between gap-md">
        <h1 className="font-display font-bold text-primary-dark text-2xl">Réponses</h1>
        <div className="flex gap-sm">
          <a
            href={csvHref}
            className="inline-flex items-center px-4 py-2 text-sm font-display font-bold rounded-md border-2 border-primary text-primary-dark bg-white hover:bg-primary-mist transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
          >
            Exporter CSV
          </a>
          <a
            href={xlsxHref}
            className="inline-flex items-center px-4 py-2 text-sm font-display font-bold rounded-md border-2 border-primary text-primary-dark bg-white hover:bg-primary-mist transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
          >
            Exporter Excel
          </a>
        </div>
      </div>

      <ResponsesTable
        initialData={data}
        initialTotal={total}
        pageSize={PAGE_SIZE}
      />
    </main>
  )
}
