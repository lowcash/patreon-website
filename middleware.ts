import { NextRequest, NextResponse } from 'next/server'

export function middleware(req: NextRequest) {
  const unauthorized = new NextResponse('Authentication Required', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Admin Panel"',
    },
  })

  // 1. If signed out, challenge with 401 to clear browser cache and delete reset cookie
  if (req.cookies.has('admin_reset')) {
    unauthorized.cookies.delete('admin_session')
    unauthorized.cookies.delete('admin_reset')
    return unauthorized
  }

  // 2. If valid session active, allow
  if (req.cookies.get('admin_session')?.value === 'true') {
    return NextResponse.next()
  }

  // 3. Check Basic Auth credentials
  const authHeader = req.headers.get('authorization')
  if (authHeader?.startsWith('Basic ')) {
    try {
      const base64 = authHeader.substring(6).trim()
      const decoded =
        typeof atob === 'function'
          ? atob(base64)
          : Buffer.from(base64, 'base64').toString('utf-8')

      const colonIndex = decoded.indexOf(':')
      if (colonIndex !== -1) {
        const user = decoded.substring(0, colonIndex)
        const pass = decoded.substring(colonIndex + 1)

        const rawUser = process.env.AUTH_USERNAME || 'admin'
        const rawPass = process.env.AUTH_PASSWORD || 'admin'
        const expectedUser = rawUser.replace(/^['"]|['"]$/g, '')
        const expectedPass = rawPass.replace(/^['"]|['"]$/g, '')

        if (user === expectedUser && pass === expectedPass) {
          const res = NextResponse.next()
          res.cookies.set({
            name: 'admin_session',
            value: 'true',
            path: '/',
            httpOnly: true,
            sameSite: 'lax',
          })
          return res
        }
      }
    } catch {}
  }

  return unauthorized
}

export const config = {
  matcher: ['/admin/:path*'],
}
