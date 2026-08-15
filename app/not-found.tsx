import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="text-center py-24 space-y-3">
      <p className="text-sm text-neutral-500">Page not found.</p>
      <Link href="/" className="text-xs text-neutral-900 underline">
        Return home
      </Link>
    </div>
  )
}
