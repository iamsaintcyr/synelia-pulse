import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { getExportData, sanitizeCsvCell, type AdminFilters } from '@/lib/queries/admin'
import Papa from 'papaparse'
import ExcelJS from 'exceljs'
import { format } from 'date-fns'

const COLUMNS = [
  'id', 'submittedAt', 'workContext', 'satisfactionScore',
  'obstacles', 'improvements', 'aiPerception', 'comment', 'additionalComment',
] as const

export async function GET(req: Request) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const fmt = searchParams.get('format') === 'xlsx' ? 'xlsx' : 'csv'

  const filters: AdminFilters = {}
  const from = searchParams.get('from')
  const to   = searchParams.get('to')
  const wc   = searchParams.get('workContext')
  if (from) filters.from = new Date(from)
  if (to)   filters.to   = new Date(to)
  if (wc)   filters.workContext = wc

  const rows = await getExportData(filters)
  const dateStr = format(new Date(), 'yyyy-MM-dd')
  const filename = `reponses-synelia-${dateStr}`

  // Small-group guard: when workContext filter active and count < 5, omit workContext column
  const omitWorkContext = Boolean(filters.workContext && rows.length < 5)
  const activeColumns = omitWorkContext
    ? COLUMNS.filter(c => c !== 'workContext')
    : [...COLUMNS]

  // Build flat row objects for export
  const exportRows = rows.map(r => {
    const obj: Record<string, string> = {}
    for (const col of activeColumns) {
      const val = r[col as keyof typeof r]
      if (Array.isArray(val)) {
        obj[col] = sanitizeCsvCell(val.join(', '))
      } else {
        obj[col] = sanitizeCsvCell(val != null ? String(val) : null)
      }
    }
    return obj
  })

  if (fmt === 'csv') {
    const disclaimerRows = omitWorkContext
      ? [Object.fromEntries(activeColumns.map((c, i) => [c, i === 0 ? '# Colonne workContext omise (groupe < 5 réponses)' : '']))]
      : []

    const csv = Papa.unparse([...disclaimerRows, ...exportRows], { header: true })
    return new Response(csv, {
      headers: {
        'Content-Type':        'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="${filename}.csv"`,
      },
    })
  }

  // XLSX
  const workbook  = new ExcelJS.Workbook()
  const worksheet = workbook.addWorksheet('Réponses')

  if (omitWorkContext) {
    worksheet.addRow(['# Colonne workContext omise (groupe < 5 réponses)'])
    worksheet.addRow([])
  }

  worksheet.columns = activeColumns.map(col => ({ header: col, key: col }))
  for (const row of exportRows) {
    worksheet.addRow(row)
  }

  const buffer = await workbook.xlsx.writeBuffer()
  return new Response(buffer, {
    headers: {
      'Content-Type':        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': `attachment; filename="${filename}.xlsx"`,
    },
  })
}
