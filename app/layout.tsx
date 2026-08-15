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
      <body className="min-h-screen bg-[#fafafa] text-neutral-900 antialiased font-sans">
        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          {children}
        </main>
      </body>
    </html>
  )
}
