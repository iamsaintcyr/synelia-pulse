import { redirect } from 'next/navigation'
import { auth, signOut } from '@/lib/auth'
import Link from 'next/link'
import { LayoutDashboard, List, LogOut } from 'lucide-react'

const NAV_LINKS = [
  { href: '/admin',          label: 'Tableau de bord', icon: LayoutDashboard },
  { href: '/admin/reponses', label: 'Réponses',         icon: List             },
]

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  if (!session) redirect('/admin/login')

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 bg-primary-night flex flex-col shrink-0">
        <div className="px-lg py-xl">
          <span className="font-display font-bold text-white text-sm tracking-widest uppercase opacity-70">
            Synelia
          </span>
          <p className="font-display font-bold text-white text-lg mt-xs leading-tight">
            Pôle Développement
          </p>
        </div>

        <nav className="flex flex-col px-sm flex-1" aria-label="Navigation administration">
          {NAV_LINKS.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-sm px-md py-[10px] rounded-md text-white text-sm font-display font-bold transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              <Icon size={18} aria-hidden="true" />
              {label}
            </Link>
          ))}
        </nav>

        <div className="px-sm pb-lg">
          <form
            action={async () => {
              'use server'
              await signOut({ redirectTo: '/' })
            }}
          >
            <button
              type="submit"
              className="flex items-center gap-sm px-md py-[10px] rounded-md text-white/60 text-sm font-display font-bold w-full transition-colors hover:bg-white/10 hover:text-white"
            >
              <LogOut size={18} aria-hidden="true" />
              Déconnexion
            </button>
          </form>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 bg-gray-light overflow-auto">
        {children}
      </div>
    </div>
  )
}
