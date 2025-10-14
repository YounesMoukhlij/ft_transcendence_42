// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Define your protected and public paths
const PROTECTED_PATHS = ['/dashboard', '/profile', '/settings'] // Use paths from your (protected) group
const PUBLIC_PATHS = ['/signIn', '/signUp']

export function middleware(request: NextRequest) {
  // ⚠️ IMPORTANT: Replace 'auth_token' with the actual name of your authentication cookie.
  const isAuthenticated = request.cookies.has('auth_token') 
  const currentPath = request.nextUrl.pathname

  const isProtectedPath = PROTECTED_PATHS.some(path => currentPath.startsWith(path))
  const isPublicPath = PUBLIC_PATHS.some(path => currentPath.startsWith(path))

  // 1. If trying to access a PROTECTED route without a token, redirect to signIn
  if (isProtectedPath && !isAuthenticated) {
    const signInUrl = new URL('/signIn', request.url)
    // Optional: Add a redirect query parameter to return the user after login
    // signInUrl.searchParams.set('redirect', currentPath) 
    return NextResponse.redirect(signInUrl)
  }

  // 2. If trying to access a PUBLIC route while ALREADY logged in, redirect to dashboard
  if (isPublicPath && isAuthenticated) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }
  
  return NextResponse.next()
}

// 3. Configure the paths where middleware should run
export const config = {
  // Use a regex to match all paths except for static files, API calls, etc.
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|assets).*)',
  ],
}