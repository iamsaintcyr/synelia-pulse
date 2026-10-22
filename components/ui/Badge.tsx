import { cn } from '@/lib/utils'

type BadgeVariant = 'neutral' | 'success' | 'warning' | 'error' | 'info'

interface BadgeProps {
  variant?: BadgeVariant
  children: React.ReactNode
  className?: string
}

const variantClasses: Record<BadgeVariant, string> = {
  neutral: 'bg-primary-mist text-primary-dark',
  success: 'bg-success-mist text-success',
  warning: 'bg-warning-mist text-warning',
  error:   'bg-error-mist text-error',
  info:    'bg-blue-mist text-blue-link',
}

export function Badge({ variant = 'neutral', children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-pill px-[10px] py-[4px] font-display font-bold text-[11px]',
        variantClasses[variant],
        className,
      )}
    >
      {children}
    </span>
  )
}
