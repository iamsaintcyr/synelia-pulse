import { cn } from '@/lib/utils'
import type { HTMLAttributes } from 'react'

interface CardProps extends HTMLAttributes<HTMLDivElement> {}

export function Card({ className, children, ...props }: CardProps) {
  return (
    <div
      className={cn('bg-white border border-border rounded-lg shadow-sm p-lg', className)}
      {...props}
    >
      {children}
    </div>
  )
}

interface KpiCardProps {
  label: string
  value: string | number
  sub?: string
  accented?: boolean
  className?: string
}

export function KpiCard({ label, value, sub, accented, className }: KpiCardProps) {
  return (
    <Card className={cn(accented && 'border-t-[3px] border-t-accent', className)}>
      <p className="text-sm text-gray-text mb-sm">{label}</p>
      <p className="font-display font-bold text-3xl text-ink">{value}</p>
      {sub && <p className="text-sm text-gray-text mt-xs">{sub}</p>}
    </Card>
  )
}
