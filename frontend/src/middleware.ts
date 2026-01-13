import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const PROTECTED_PATHS = [
  '/',
  '/chat',
  '/profile',
  '/dashboard',
  '/settings',
  '/leaderboard',
  '/game',
]

const PUBLIC_PATHS = ['/signIn', '/signUp']

export function middleware(request: NextRequest) {
  const isAuthenticated = request.cookies.has('auth_token')
  const currentPath = request.nextUrl.pathname

  const isPublicPath = PUBLIC_PATHS.some(path =>
    currentPath === path || currentPath.startsWith(path)
  )

  const isProtectedPath = PROTECTED_PATHS.some(path =>
    currentPath === path || currentPath.startsWith(path + '/')
  )

  // 1️⃣ Not logged in → block protected routes
  if (isProtectedPath && !isPublicPath && !isAuthenticated) {
    return NextResponse.redirect(new URL('/signIn', request.url))
  }

  // 2️⃣ Logged in → block auth pages
  if (isPublicPath && isAuthenticated) {
    return NextResponse.redirect(new URL('/profile', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|assets).*)'],
}