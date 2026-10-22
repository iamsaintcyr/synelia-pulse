import { cn } from '@/lib/utils'
import { type ButtonHTMLAttributes, forwardRef } from 'react'

type ButtonVariant = 'accent' | 'primary' | 'secondary' | 'ghost'
type ButtonSize = 'md' | 'sm'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
}

const variantClasses: Record<ButtonVariant, string> = {
  accent:    'bg-accent text-white hover:bg-[#096463] focus-visible:ring-primary-dark',
  primary:   'bg-primary text-white hover:bg-primary-dark focus-visible:ring-accent',
  secondary: 'bg-white text-primary-dark border-2 border-primary hover:bg-primary-mist focus-visible:ring-accent',
  ghost:     'text-accent underline-offset-2 hover:underline',
}

const sizeClasses: Record<ButtonSize, string> = {
  md: 'px-6 py-3 text-base',
  sm: 'px-4 py-2 text-sm',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'accent', size = 'md', className, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        'font-display font-bold rounded-md transition-all duration-150',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
      {...props}
    />
  ),
)

Button.displayName = 'Button'
