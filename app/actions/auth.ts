'use server'

import { cookies } from 'next/headers'

export async function signOutAction(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.set({
    name: 'admin_reset',
    value: 'true',
    path: '/',
    httpOnly: true,
    sameSite: 'lax',
  })
}
