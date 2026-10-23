'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, List } from 'lucide-react'
import { cn } from '@/lib/utils'

const NAV_LINKS = [
  { href: '/admin',          label: 'Tableau de bord', icon: LayoutDashboard },
  { href: '/admin/reponses', label: 'Réponses',         icon: List             },
]

export function SidebarNav() {
  const pathname = usePathname()

  return (
    <nav className="flex flex-col px-sm flex-1" aria-label="Navigation administration">
      {NAV_LINKS.map(({ href, label, icon: Icon }) => {
        const active = pathname === href
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? 'page' : undefined}
            className={cn(
              'flex items-center gap-sm px-md py-[10px] rounded-md text-white',
              'text-[0.9375rem] font-display font-bold transition-colors',
              'border-l-[3px] border-transparent',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent',
              active
                ? 'border-l-accent bg-white/15'
                : 'hover:bg-white/10',
            )}
          >
            <Icon size={18} aria-hidden="true" />
            {label}
          </Link>
        )
      })}
    </nav>
  )
}
