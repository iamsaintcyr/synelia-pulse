'use client'

import { cn } from '@/lib/utils'

interface SingleChoiceProps {
  label: string
  name: string
  options: { value: string; label: string }[]
  value: string | undefined
  onChange: (value: string) => void
  className?: string
}

export function SingleChoice({ label, name, options, value, onChange, className }: SingleChoiceProps) {
  return (
    <fieldset className={cn('flex flex-col gap-sm', className)}>
      <legend className="font-display font-bold text-ink text-base mb-sm">{label}</legend>
      <div role="radiogroup" className="flex flex-col gap-sm">
        {options.map((opt) => {
          const id = `${name}-${opt.value}`
          const checked = value === opt.value
          return (
            <label
              key={opt.value}
              htmlFor={id}
              className={cn(
                'flex items-center gap-md p-md rounded-md border cursor-pointer transition-all duration-150',
                checked
                  ? 'border-accent bg-accent-mist'
                  : 'border-border bg-white hover:bg-primary-mist',
              )}
            >
              <input
                type="radio"
                id={id}
                name={name}
                value={opt.value}
                checked={checked}
                onChange={() => onChange(opt.value)}
                className="accent-accent w-4 h-4 shrink-0"
              />
              <span className="text-ink text-base">{opt.label}</span>
            </label>
          )
        })}
      </div>
    </fieldset>
  )
}
