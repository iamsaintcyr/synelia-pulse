'use client'

import { cn } from '@/lib/utils'
import { forwardRef, type InputHTMLAttributes, type TextareaHTMLAttributes } from 'react'

const fieldBase =
  'w-full border border-border rounded-md px-[14px] py-[10px] text-base text-ink bg-white ' +
  'placeholder:text-gray-text focus:border-2 focus:border-accent focus:bg-accent-mist ' +
  'focus:outline-none aria-invalid:border-error aria-invalid:bg-error-mist transition-colors'

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input ref={ref} className={cn(fieldBase, className)} {...props} />
  ),
)
Input.displayName = 'Input'

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  showCount?: boolean
  maxLength?: number
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, showCount, maxLength, value, ...props }, ref) => (
    <div className="w-full">
      <textarea
        ref={ref}
        maxLength={maxLength}
        value={value}
        className={cn(fieldBase, 'min-h-[120px] resize-y', className)}
        {...props}
      />
      {showCount && (
        <span className="block text-xs text-gray-text text-right mt-xs">
          {String(value ?? '').length}/{maxLength ?? 2000}
        </span>
      )}
    </div>
  ),
)
Textarea.displayName = 'Textarea'

interface FormFieldProps {
  label: string
  hint?: string
  error?: string
  required?: boolean
  children: React.ReactNode
  className?: string
}

export function FormField({ label, hint, error, required, children, className }: FormFieldProps) {
  return (
    <div className={cn('flex flex-col gap-sm', className)}>
      <label className="font-display font-bold text-ink text-base">
        {label}
        {required && <span className="text-error ml-xs" aria-hidden="true">*</span>}
      </label>
      {hint && <p className="text-sm text-gray-text -mt-xs">{hint}</p>}
      {children}
      {error && <p className="text-sm text-error">{error}</p>}
    </div>
  )
}
