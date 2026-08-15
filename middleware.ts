import { NextRequest, NextResponse } from 'next/server'

export function middleware(req: NextRequest) {
  const rawUser = process.env.AUTH_USERNAME || 'admin'
  const rawPass = process.env.AUTH_PASSWORD || 'admin'
  const expectedUser = rawUser.replace(/^['"]|['"]$/g, '')
  const expectedPass = rawPass.replace(/^['"]|['"]$/g, '')

  const authHeader = req.headers.get('authorization')
  const hasReset = req.cookies.has('admin_reset')

  // 1. Check if incoming request has valid basic auth credentials
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

        if (user === expectedUser && pass === expectedPass) {
          const res = NextResponse.next()
          if (hasReset) {
            res.cookies.delete('admin_reset')
          }
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

  // 2. Check if valid session exists and not explicitly reset
  if (!hasReset && req.cookies.get('admin_session')?.value === 'true') {
    return NextResponse.next()
  }

  // 3. Challenge with 401 & clear stale cookies
  const unauthorized = new NextResponse('Authentication Required', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Admin Panel"',
    },
  })

  if (hasReset) {
    unauthorized.cookies.delete('admin_reset')
    unauthorized.cookies.delete('admin_session')
  }

  return unauthorized
}

export const config = {
  matcher: ['/admin/:path*'],
}
