'use client'

import { FormField, Textarea } from '@/components/ui/Input'

interface TextQuestionProps {
  label: string
  name: string
  value: string
  onChange: (value: string) => void
  hint?: string
  maxLength?: number
  className?: string
}

export function TextQuestion({
  label,
  name,
  value,
  onChange,
  hint,
  maxLength = 2000,
  className,
}: TextQuestionProps) {
  return (
    <FormField label={label} hint={hint} className={className}>
      <Textarea
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        maxLength={maxLength}
        showCount
      />
    </FormField>
  )
}
