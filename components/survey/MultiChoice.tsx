'use client'

import { cn } from '@/lib/utils'

interface MultiChoiceProps {
  label: string
  name: string
  options: { value: string; label: string }[]
  value: string[]
  onChange: (value: string[]) => void
  exclusiveValues?: string[]
  className?: string
}

export function MultiChoice({
  label,
  name,
  options,
  value,
  onChange,
  exclusiveValues = [],
  className,
}: MultiChoiceProps) {
  const exclusiveSelected = exclusiveValues.find((v) => value.includes(v))

  function handleChange(optValue: string, checked: boolean) {
    const isExclusive = exclusiveValues.includes(optValue)
    if (checked) {
      if (isExclusive) {
        onChange([optValue])
      } else {
        onChange([...value.filter((v) => !exclusiveValues.includes(v)), optValue])
      }
    } else {
      onChange(value.filter((v) => v !== optValue))
    }
  }

  return (
    <fieldset className={cn('flex flex-col gap-sm', className)}>
      <legend className="font-display font-bold text-ink text-base mb-sm">{label}</legend>
      <div className="flex flex-col gap-sm">
        {options.map((opt) => {
          const id = `${name}-${opt.value}`
          const checked = value.includes(opt.value)
          const isExclusive = exclusiveValues.includes(opt.value)
          const disabled = !isExclusive && !!exclusiveSelected

          return (
            <label
              key={opt.value}
              htmlFor={id}
              className={cn(
                'flex items-center gap-md p-md rounded-md border cursor-pointer transition-all duration-150',
                checked && !disabled
                  ? 'border-accent bg-accent-mist'
                  : 'border-border bg-white hover:bg-primary-mist',
                disabled && 'opacity-40 cursor-not-allowed pointer-events-none',
              )}
            >
              <input
                type="checkbox"
                id={id}
                name={name}
                value={opt.value}
                checked={checked}
                disabled={disabled}
                onChange={(e) => handleChange(opt.value, e.target.checked)}
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
