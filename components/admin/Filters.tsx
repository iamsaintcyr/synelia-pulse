'use client'

import { WORK_CONTEXTS, WORK_CONTEXT_LABELS } from '@/lib/validations/feedback'
import type { AdminFilters } from '@/lib/queries/admin'

interface FiltersProps {
  value:    AdminFilters & { workContext?: string }
  onChange: (f: AdminFilters) => void
}

export function Filters({ value, onChange }: FiltersProps) {
  function set(patch: Partial<AdminFilters>) {
    onChange({ ...value, ...patch })
  }

  function reset() {
    onChange({})
  }

  return (
    <div className="flex flex-wrap items-end gap-md bg-white border border-border rounded-lg p-md shadow-sm">
      <div className="flex flex-col gap-xs">
        <label className="text-xs font-display font-bold text-slate uppercase tracking-wide">
          Du
        </label>
        <input
          type="date"
          value={value.from ? value.from.toISOString().slice(0, 10) : ''}
          onChange={e => set({ from: e.target.value ? new Date(e.target.value) : undefined })}
          className="border border-border rounded-md px-[10px] py-[8px] text-sm text-ink bg-white focus:border-accent focus:outline-none"
        />
      </div>

      <div className="flex flex-col gap-xs">
        <label className="text-xs font-display font-bold text-slate uppercase tracking-wide">
          Au
        </label>
        <input
          type="date"
          value={value.to ? value.to.toISOString().slice(0, 10) : ''}
          onChange={e => set({ to: e.target.value ? new Date(e.target.value) : undefined })}
          className="border border-border rounded-md px-[10px] py-[8px] text-sm text-ink bg-white focus:border-accent focus:outline-none"
        />
      </div>

      <div className="flex flex-col gap-xs">
        <label className="text-xs font-display font-bold text-slate uppercase tracking-wide">
          Contexte de travail
        </label>
        <select
          value={value.workContext ?? ''}
          onChange={e => set({ workContext: e.target.value || undefined })}
          className="border border-border rounded-md px-[10px] py-[8px] text-sm text-ink bg-white focus:border-accent focus:outline-none"
        >
          <option value="">Tous les contextes</option>
          {WORK_CONTEXTS.map(wc => (
            <option key={wc} value={wc}>{WORK_CONTEXT_LABELS[wc]}</option>
          ))}
        </select>
      </div>

      <button
        type="button"
        onClick={reset}
        className="text-accent text-sm font-display font-bold underline-offset-2 hover:underline pb-[8px]"
      >
        Réinitialiser
      </button>
    </div>
  )
}
