import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Videos',
  description: 'Video collection',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#fcfcfc] text-[#111] antialiased">
        <main className="max-w-2xl mx-auto px-4 py-8">
          {children}
        </main>
      </body>
    </html>
  )
}
