'use client'

import { useState, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import {
  useReactTable, getCoreRowModel, flexRender,
  createColumnHelper,
} from '@tanstack/react-table'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { ResponseDetail } from './ResponseDetail'
import { WORK_CONTEXT_LABELS, OBSTACLE_LABELS, IMPROVEMENT_LABELS, AI_PERCEPTION_LABELS } from '@/lib/validations/feedback'
import type { ResponseRow } from '@/lib/queries/admin'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface Props {
  initialData:  ResponseRow[]
  initialTotal: number
  pageSize:     number
}

function scoreVariant(score: number | null): 'success' | 'neutral' | 'error' {
  if (score == null) return 'neutral'
  if (score >= 4)   return 'success'
  if (score === 3)  return 'neutral'
  return 'error'
}

function TagList({ items, labels }: { items: string[]; labels: Record<string, string> }) {
  const visible = items.slice(0, 2)
  const overflow = items.length - visible.length
  return (
    <div className="flex flex-wrap gap-xs">
      {visible.map(v => (
        <Badge key={v} variant="neutral">{labels[v] ?? v}</Badge>
      ))}
      {overflow > 0 && <Badge variant="neutral">+{overflow}</Badge>}
    </div>
  )
}

const col = createColumnHelper<ResponseRow>()

const COLUMNS = [
  col.accessor('submittedAt', {
    header: 'Date',
    cell: info => format(new Date(info.getValue()), 'dd/MM/yyyy HH:mm', { locale: fr }),
  }),
  col.accessor('workContext', {
    header: 'Contexte',
    cell: info => {
      const v = info.getValue()
      return v ? (WORK_CONTEXT_LABELS[v] ?? v) : '—'
    },
  }),
  col.accessor('satisfactionScore', {
    header: 'Satisfaction',
    cell: info => {
      const v = info.getValue()
      return v != null
        ? <Badge variant={scoreVariant(v)}>{v}/5</Badge>
        : <span className="text-gray-text">—</span>
    },
  }),
  col.accessor('obstacles', {
    header: 'Obstacles',
    cell: info => <TagList items={info.getValue()} labels={OBSTACLE_LABELS} />,
  }),
  col.accessor('improvements', {
    header: 'Améliorations',
    cell: info => <TagList items={info.getValue()} labels={IMPROVEMENT_LABELS} />,
  }),
  col.accessor('aiPerception', {
    header: 'Perception IA',
    cell: info => <TagList items={info.getValue()} labels={AI_PERCEPTION_LABELS} />,
  }),
]

export function ResponsesTable({ initialData, initialTotal, pageSize }: Props) {
  const [data,     setData]     = useState<ResponseRow[]>(initialData)
  const [total,    setTotal]    = useState(initialTotal)
  const [page,     setPage]     = useState(1)
  const [loading,  setLoading]  = useState(false)
  const [selected, setSelected] = useState<ResponseRow | null>(null)
  const searchParams = useSearchParams()

  const totalPages = Math.max(1, Math.ceil(total / pageSize))

  const goToPage = useCallback(async (next: number) => {
    setLoading(true)
    const params = new URLSearchParams()
    params.set('page', String(next))
    params.set('limit', String(pageSize))
    const from = searchParams.get('from')
    const to   = searchParams.get('to')
    const wc   = searchParams.get('workContext')
    if (from) params.set('from', from)
    if (to)   params.set('to', to)
    if (wc)   params.set('workContext', wc)
    const res  = await fetch(`/api/admin/reponses?${params.toString()}`)
    const json = await res.json()
    setData(json.data ?? [])
    setTotal(json.total ?? 0)
    setPage(next)
    setLoading(false)
  }, [pageSize, searchParams])

  const table = useReactTable({
    data,
    columns: COLUMNS,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <>
      <div className="bg-white border border-border rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm" aria-label="Tableau des réponses">
            <thead className="bg-primary-mist border-b border-border">
              {table.getHeaderGroups().map(hg => (
                <tr key={hg.id}>
                  {hg.headers.map(header => (
                    <th
                      key={header.id}
                      className="text-left px-md py-[10px] font-display font-bold text-primary-dark text-xs uppercase tracking-wide whitespace-nowrap"
                    >
                      {flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row, i) => (
                <tr
                  key={row.id}
                  onClick={() => setSelected(row.original)}
                  className={`border-b border-border last:border-0 cursor-pointer transition-colors hover:bg-primary-mist ${i % 2 === 0 ? 'bg-white' : 'bg-gray-light/50'}`}
                >
                  {row.getVisibleCells().map(cell => (
                    <td key={cell.id} className="px-md py-[10px] text-ink align-top">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
              {data.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-md py-xl text-center text-gray-text">
                    Aucune réponse enregistrée.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-md py-sm border-t border-border bg-gray-light/50">
          <span className="text-sm text-gray-text">
            {total} réponse{total !== 1 ? 's' : ''} · Page {page} / {totalPages}
          </span>
          <div className="flex gap-sm">
            <Button
              variant="secondary"
              size="sm"
              disabled={page <= 1 || loading}
              onClick={() => goToPage(page - 1)}
              aria-label="Page précédente"
            >
              <ChevronLeft size={16} aria-hidden="true" />
              Précédent
            </Button>
            <Button
              variant="secondary"
              size="sm"
              disabled={page >= totalPages || loading}
              onClick={() => goToPage(page + 1)}
              aria-label="Page suivante"
            >
              Suivant
              <ChevronRight size={16} aria-hidden="true" />
            </Button>
          </div>
        </div>
      </div>

      <ResponseDetail response={selected} onClose={() => setSelected(null)} />
    </>
  )
}
