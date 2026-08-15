import { NextRequest, NextResponse } from 'next/server'

export function middleware(req: NextRequest) {
  const basicAuth = req.headers.get('authorization')
  const expectedUser = process.env.AUTH_USERNAME || 'admin'
  const expectedPass = process.env.AUTH_PASSWORD || 'admin'

  if (basicAuth) {
    const authValue = basicAuth.split(' ')[1]
    if (authValue) {
      const [user, pwd] = Buffer.from(authValue, 'base64').toString().split(':')
      if (user === expectedUser && pwd === expectedPass) {
        return NextResponse.next()
      }
    }
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
