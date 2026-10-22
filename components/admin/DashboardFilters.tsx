'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Filters } from './Filters'
import type { AdminFilters } from '@/lib/queries/admin'

export function DashboardFilters() {
  const router       = useRouter()
  const searchParams = useSearchParams()

  const current: AdminFilters = {
    from:        searchParams.get('from')        ? new Date(searchParams.get('from')!) : undefined,
    to:          searchParams.get('to')          ? new Date(searchParams.get('to')!)   : undefined,
    workContext: searchParams.get('workContext') ?? undefined,
  }

  function handleChange(filters: AdminFilters) {
    const params = new URLSearchParams()
    if (filters.from)        params.set('from', filters.from.toISOString().slice(0, 10))
    if (filters.to)          params.set('to', filters.to.toISOString().slice(0, 10))
    if (filters.workContext) params.set('workContext', filters.workContext)
    router.push(`/admin?${params.toString()}`)
  }

  return <Filters value={current} onChange={handleChange} />
}
