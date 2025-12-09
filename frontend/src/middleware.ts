// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const PROTECTED_PATHS = ['/chat', '/profile', '/dashboard', '/settings', '/leaderboard']
const PUBLIC_PATHS = ['/signIn', '/signUp']

export function middleware(request: NextRequest) {
  // Check for the cookie
  const isAuthenticated = request.cookies.has('auth_token') 
  const currentPath = request.nextUrl.pathname

  const isProtectedPath = PROTECTED_PATHS.some(path => currentPath.startsWith(path))
  const isPublicPath = PUBLIC_PATHS.some(path => currentPath.startsWith(path))

  // 1. Protect private routes
  if (isProtectedPath && !isAuthenticated) {
    const signInUrl = new URL('/signIn', request.url)
    // It's good practice to send them back to where they were trying to go after login
    // signInUrl.searchParams.set('callbackUrl', currentPath) 
    return NextResponse.redirect(signInUrl)
  }

  // 2. Redirect logged-in users away from Public routes (Optional but recommended)
  if (isPublicPath && isAuthenticated) {
     return NextResponse.redirect(new URL('/', request.url))
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|assets).*)',
  ],
}