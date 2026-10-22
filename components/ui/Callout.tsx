import { cn } from '@/lib/utils'
import { Info, CheckCircle, AlertTriangle, XCircle } from 'lucide-react'

type CalloutVariant = 'info' | 'success' | 'warning' | 'error'

interface CalloutProps {
  variant?: CalloutVariant
  children: React.ReactNode
  className?: string
}

const variantConfig: Record<CalloutVariant, { border: string; bg: string; icon: React.ElementType; iconColor: string }> = {
  info:    { border: 'border-blue-link',  bg: 'bg-blue-mist',     icon: Info,          iconColor: 'text-blue-link'  },
  success: { border: 'border-success',    bg: 'bg-success-mist',  icon: CheckCircle,   iconColor: 'text-success'    },
  warning: { border: 'border-warning',    bg: 'bg-warning-mist',  icon: AlertTriangle, iconColor: 'text-warning'    },
  error:   { border: 'border-error',      bg: 'bg-error-mist',    icon: XCircle,       iconColor: 'text-error'      },
}

export function Callout({ variant = 'info', children, className }: CalloutProps) {
  const { border, bg, icon: Icon, iconColor } = variantConfig[variant]
  return (
    <div className={cn('border-l-4 rounded-r-sm p-[14px] flex gap-sm', border, bg, className)}>
      <Icon className={cn('shrink-0 mt-[2px]', iconColor)} size={18} aria-hidden="true" />
      <div className="text-ink text-sm">{children}</div>
    </div>
  )
}
