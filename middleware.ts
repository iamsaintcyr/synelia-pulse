import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'

export default auth((req) => {
  const isAdminRoute = req.nextUrl.pathname.startsWith('/admin') ||
                       req.nextUrl.pathname.startsWith('/api/admin')
  const isLoginPage  = req.nextUrl.pathname === '/admin/login'
  if (isAdminRoute && !isLoginPage && !req.auth) {
    return NextResponse.redirect(new URL('/admin/login', req.url))
  }
})

export const config = { matcher: ['/admin/:path*', '/api/admin/:path*'] }
