import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Videos',
  description: 'Video Feed',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-neutral-50 text-neutral-900 antialiased font-sans">
        <main className="max-w-xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
          {children}
        </main>
      </body>
    </html>
  )
}
