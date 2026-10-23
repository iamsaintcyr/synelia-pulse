import { redirect } from 'next/navigation'
import { auth, signOut } from '@/lib/auth'
import { LogOut } from 'lucide-react'
import { SidebarNav } from '@/components/admin/SidebarNav'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  if (!session) redirect('/admin/login')

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 bg-primary-night flex flex-col shrink-0">
        <div className="px-lg py-xl flex flex-col gap-xs">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo-blanc.png" alt="Synelia" className="h-8 w-auto self-start" />
          <p className="font-body text-white/60 text-[0.75rem] leading-tight tracking-wide uppercase">
            Pôle Développement
          </p>
        </div>

        <SidebarNav />

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
