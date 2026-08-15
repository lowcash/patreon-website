'use client'

import { useState, useTransition } from 'react'
import { createVideo, updateVideo, deleteVideo } from '@/app/actions/videos'
import { Video } from '@/lib/types'
import Link from 'next/link'
import { Trash2, Edit3, X, Check } from 'lucide-react'

export default function AdminClient({ initialVideos }: { initialVideos: Video[] }) {
  const [videos, setVideos] = useState<Video[]>(initialVideos)
  const [isPending, startTransition] = useTransition()

  // New video inputs
  const [title, setTitle] = useState('')
  const [youtubeUrl, setYoutubeUrl] = useState('')
  const [description, setDescription] = useState('')

  // Edit state
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editTitle, setEditTitle] = useState('')
  const [editYoutubeUrl, setEditYoutubeUrl] = useState('')
  const [editDescription, setEditDescription] = useState('')

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    startTransition(async () => {
      const res = await createVideo({ title, description, youtubeUrl })
      if (res.success) {
        setVideos([
          {
            id: 'vid_' + Date.now(),
            title,
            description,
            youtubeUrl,
            createdAt: new Date().toISOString(),
          },
          ...videos,
        ])
        setTitle('')
        setYoutubeUrl('')
        setDescription('')
      }
    })
  }

  const startEdit = (v: Video) => {
    setEditingId(v.id)
    setEditTitle(v.title)
    setEditYoutubeUrl(v.youtubeUrl)
    setEditDescription(v.description)
  }

  const handleSaveEdit = async (id: string) => {
    startTransition(async () => {
      const res = await updateVideo(id, {
        title: editTitle,
        description: editDescription,
        youtubeUrl: editYoutubeUrl,
      })
      if (res.success) {
        setVideos(
          videos.map((v) =>
            v.id === id
              ? { ...v, title: editTitle, description: editDescription, youtubeUrl: editYoutubeUrl }
              : v
          )
        )
        setEditingId(null)
      }
    })
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete video?')) return
    startTransition(async () => {
      await deleteVideo(id)
      setVideos(videos.filter((v) => v.id !== id))
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Link
          href="/"
          className="text-xs text-neutral-500 hover:text-neutral-900 transition-colors"
        >
          &larr; View Feed
        </Link>
        <span className="text-xs text-neutral-400 font-mono">admin</span>
      </div>

      {/* Add video */}
      <form onSubmit={handleAdd} className="bg-white border border-neutral-200 rounded-lg p-4 space-y-3">
        <input
          type="text"
          required
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-3 py-1.5 text-sm border border-neutral-200 rounded focus:outline-hidden focus:border-neutral-900"
        />

        <input
          type="text"
          required
          placeholder="YouTube URL"
          value={youtubeUrl}
          onChange={(e) => setYoutubeUrl(e.target.value)}
          className="w-full px-3 py-1.5 text-sm border border-neutral-200 rounded focus:outline-hidden focus:border-neutral-900"
        />

        <textarea
          rows={3}
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-3 py-1.5 text-sm border border-neutral-200 rounded focus:outline-hidden focus:border-neutral-900"
        />

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isPending}
            className="px-3.5 py-1.5 bg-neutral-900 text-white text-xs font-medium rounded hover:bg-neutral-800 disabled:opacity-50"
          >
            {isPending ? 'Adding...' : 'Add Video'}
          </button>
        </div>
      </form>

      {/* Video list */}
      <div className="space-y-2">
        {videos.map((video) => {
          if (editingId === video.id) {
            return (
              <div key={video.id} className="bg-white border-2 border-neutral-900 rounded-lg p-3 space-y-2">
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full px-2 py-1 text-sm border border-neutral-200 rounded"
                />
                <input
                  type="text"
                  value={editYoutubeUrl}
                  onChange={(e) => setEditYoutubeUrl(e.target.value)}
                  className="w-full px-2 py-1 text-sm border border-neutral-200 rounded"
                />
                <textarea
                  rows={3}
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="w-full px-2 py-1 text-sm border border-neutral-200 rounded"
                />
                <div className="flex justify-end gap-1.5">
                  <button
                    type="button"
                    onClick={() => setEditingId(null)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 text-xs border border-neutral-200 rounded"
                  >
                    <X className="w-3 h-3" /> Cancel
                  </button>
                  <button
                    type="button"
                    disabled={isPending}
                    onClick={() => handleSaveEdit(video.id)}
                    className="inline-flex items-center gap-1 px-3 py-1 text-xs bg-neutral-900 text-white rounded"
                  >
                    <Check className="w-3 h-3" /> Save
                  </button>
                </div>
              </div>
            )
          }

          return (
            <div
              key={video.id}
              className="bg-white border border-neutral-200 rounded-lg p-3 flex items-start justify-between gap-3"
            >
              <div className="space-y-0.5 min-w-0">
                <h3 className="font-medium text-sm text-neutral-900 truncate">{video.title}</h3>
                <p className="text-xs text-neutral-400 font-mono truncate">{video.youtubeUrl}</p>
                {video.description && (
                  <p className="text-xs text-neutral-600 line-clamp-2 mt-1">{video.description}</p>
                )}
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() => startEdit(video)}
                  className="p-1 text-neutral-400 hover:text-neutral-900 rounded"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(video.id)}
                  className="p-1 text-neutral-400 hover:text-red-600 rounded"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
