'use client'

import { cn } from '@/lib/utils'

interface NpsScaleProps {
  value: number | null
  onChange: (v: number) => void
  className?: string
}

export function NpsScale({ value, onChange, className }: NpsScaleProps) {
  return (
    <div className={cn('flex flex-col gap-sm', className)}>
      <div role="group" aria-label="Score de 0 à 10" className="flex gap-xs flex-wrap">
        {Array.from({ length: 11 }, (_, i) => {
          const selected = value === i
          return (
            <button
              key={i}
              type="button"
              aria-pressed={selected}
              onClick={() => onChange(i)}
              className={cn(
                'flex items-center justify-center w-[52px] min-h-[52px] rounded-md',
                'border transition-all duration-150 focus-visible:outline-none',
                'focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2',
                'font-display font-bold text-[1.25rem] leading-none',
                selected
                  ? 'bg-accent-mist border-2 border-accent text-primary-dark'
                  : 'bg-white border-border text-slate hover:bg-primary-mist',
              )}
            >
              {i}
            </button>
          )
        })}
      </div>
      <div className="flex justify-between">
        <span className="font-body text-[0.75rem] text-gray-text">Peu probable</span>
        <span className="font-body text-[0.75rem] text-gray-text">Très probable</span>
      </div>
    </div>
  )
}
