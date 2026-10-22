'use client'

import { cn } from '@/lib/utils'

const LABELS = [
  'Très insatisfaisante',
  'Insatisfaisante',
  'Moyenne',
  'Satisfaisante',
  'Très satisfaisante',
]

interface RatingScaleProps {
  value: number | null
  onChange: (v: number) => void
  className?: string
}

export function RatingScale({ value, onChange, className }: RatingScaleProps) {
  return (
    <div role="group" className={cn('flex gap-sm flex-wrap', className)}>
      {LABELS.map((label, i) => {
        const score = i + 1
        const selected = value === score
        return (
          <button
            key={score}
            type="button"
            aria-pressed={selected}
            onClick={() => onChange(score)}
            className={cn(
              'flex flex-col items-center justify-center w-[72px] min-h-[80px] rounded-md',
              'border transition-all duration-150 focus-visible:outline-none',
              'focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2',
              selected
                ? 'bg-accent-mist border-2 border-accent'
                : 'bg-white border-border hover:bg-primary-mist',
            )}
          >
            <span className={cn('font-display font-bold text-[1.75rem] leading-none', selected ? 'text-primary-dark' : 'text-slate')}>
              {score}
            </span>
            <span className="text-[0.625rem] text-gray-text text-center leading-tight mt-xs px-xs">
              {label}
            </span>
          </button>
        )
      })}
    </div>
  )
}
