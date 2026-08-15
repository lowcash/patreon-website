'use client'

import { useState } from 'react'

export default function VideoDescription({ description }: { description: string }) {
  const [expanded, setExpanded] = useState(false)

  if (!description) return null

  const isLong = description.length > 140 || description.includes('\n')

  return (
    <div className="space-y-1">
      <p
        className={`text-sm text-neutral-600 leading-relaxed whitespace-pre-line ${
          !expanded && isLong ? 'line-clamp-2' : ''
        }`}
      >
        {description}
      </p>

      {isLong && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-xs text-neutral-400 hover:text-neutral-900 transition-colors font-medium cursor-pointer"
        >
          {expanded ? 'Show less' : 'Show more'}
        </button>
      )}
    </div>
  )
}
