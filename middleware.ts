import { NextRequest, NextResponse } from 'next/server'

export function middleware(req: NextRequest) {
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
        return NextResponse.next()
      }
    } catch {}
  }

  return new NextResponse('Authentication Required', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Admin Panel"',
    },
  })
}

export const config = {
  matcher: ['/admin/:path*'],
}
