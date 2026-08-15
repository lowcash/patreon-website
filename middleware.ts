import { NextRequest, NextResponse } from 'next/server'

export function middleware(req: NextRequest) {
  const unauthorizedResponse = new NextResponse('Authentication Required', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Admin Panel"',
    },
  })

  // If user signed out, reset session & challenge with 401
  if (req.cookies.has('admin_reset')) {
    unauthorizedResponse.cookies.delete('admin_session')
    unauthorizedResponse.cookies.delete('admin_reset')
    return unauthorizedResponse
  }

  // If already authenticated with active session cookie
  if (req.cookies.get('admin_session')?.value === 'true') {
    return NextResponse.next()
  }

  // Check HTTP Basic Auth header
  const authHeader = req.headers.get('authorization')
  if (authHeader?.startsWith('Basic ')) {
    try {
      const base64 = authHeader.substring(6).trim()
      const decoded = Buffer.from(base64, 'base64').toString('utf-8')
      const [user, ...rest] = decoded.split(':')
      const pass = rest.join(':')

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
    } catch {}
  }

  return unauthorizedResponse
}

export const config = {
  matcher: ['/admin/:path*'],
}
