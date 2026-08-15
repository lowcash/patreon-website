'use client'

import { useState, useTransition } from 'react'
import { createVideo, updateVideo, deleteVideo, saveReorderedVideos } from '@/app/actions/videos'
import { signOutAction } from '@/app/actions/auth'
import { Video } from '@/lib/types'
import { Trash2, Edit3, X, Check, ChevronUp, ChevronDown, LogOut } from 'lucide-react'

export default function AdminClient({ initialVideos }: { initialVideos: Video[] }) {
  const [videos, setVideos] = useState<Video[]>(initialVideos)
  const [isPending, startTransition] = useTransition()
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  // New video inputs
  const [title, setTitle] = useState('')
  const [youtubeUrl, setYoutubeUrl] = useState('')
  const [description, setDescription] = useState('')

  // Edit state
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editTitle, setEditTitle] = useState('')
  const [editYoutubeUrl, setEditYoutubeUrl] = useState('')
  const [editDescription, setEditDescription] = useState('')

  const handleLogout = async () => {
    try {
      await signOutAction()
    } finally {
      window.location.href = '/'
    }
  }

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)

    startTransition(async () => {
      try {
        const res = await createVideo({ title, description, youtubeUrl })
        if (!res.success) {
          setErrorMessage(res.error || 'Failed to add video')
          return
        }
        if (res.video) {
          setVideos((prev) => [res.video!, ...prev])
        }
        setTitle('')
        setYoutubeUrl('')
        setDescription('')
      } catch (err: any) {
        setErrorMessage(err.message || 'An unexpected error occurred.')
      }
    })
  }

  const startEdit = (v: Video) => {
    setErrorMessage(null)
    setEditingId(v.id)
    setEditTitle(v.title)
    setEditYoutubeUrl(v.youtubeUrl)
    setEditDescription(v.description)
  }

  const handleSaveEdit = async (id: string) => {
    setErrorMessage(null)
    startTransition(async () => {
      try {
        const res = await updateVideo(id, {
          title: editTitle,
          description: editDescription,
          youtubeUrl: editYoutubeUrl,
        })
        if (!res.success) {
          setErrorMessage(res.error || 'Failed to update video')
          return
        }
        setVideos((prev) =>
          prev.map((v) =>
            v.id === id
              ? { ...v, title: editTitle, description: editDescription, youtubeUrl: editYoutubeUrl }
              : v
          )
        )
        setEditingId(null)
      } catch (err: any) {
        setErrorMessage(err.message || 'An unexpected error occurred.')
      }
    })
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete video?')) return
    setErrorMessage(null)
    startTransition(async () => {
      try {
        const res = await deleteVideo(id)
        if (!res.success) {
          setErrorMessage(res.error || 'Failed to delete video')
          return
        }
        setVideos((prev) => prev.filter((v) => v.id !== id))
      } catch (err: any) {
        setErrorMessage(err.message || 'An unexpected error occurred.')
      }
    })
  }

  const moveVideo = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1
    if (targetIndex < 0 || targetIndex >= videos.length) return

    const updated = [...videos]
    const [moved] = updated.splice(index, 1)
    updated.splice(targetIndex, 0, moved)
    setVideos(updated)

    startTransition(async () => {
      try {
        await saveReorderedVideos(updated)
      } catch (err: any) {
        setErrorMessage(err.message || 'Failed to save order')
      }
    })
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header bar with Logout */}
      <div className="flex justify-end pb-2">
        <button
          onClick={handleLogout}
          className="inline-flex items-center gap-1.5 text-xs text-neutral-500 hover:text-neutral-900 transition-colors cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
          Logout
        </button>
      </div>

      {errorMessage && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg">
          {errorMessage}
        </div>
      )}

      {/* Add video */}
      <form onSubmit={handleAdd} className="bg-white border border-neutral-200/80 rounded-xl p-4 space-y-3 shadow-2xs">
        <input
          type="text"
          required
          placeholder="Title *"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-3 py-2 text-sm bg-neutral-50/50 border border-neutral-200 rounded-lg focus:outline-hidden focus:border-neutral-900"
        />

        <input
          type="text"
          required
          placeholder="YouTube URL *"
          value={youtubeUrl}
          onChange={(e) => setYoutubeUrl(e.target.value)}
          className="w-full px-3 py-2 text-sm bg-neutral-50/50 border border-neutral-200 rounded-lg focus:outline-hidden focus:border-neutral-900"
        />

        <textarea
          rows={3}
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-3 py-2 text-sm bg-neutral-50/50 border border-neutral-200 rounded-lg focus:outline-hidden focus:border-neutral-900"
        />

        <div className="flex justify-end pt-1">
          <button
            type="submit"
            disabled={isPending}
            className="px-4 py-2 bg-neutral-900 text-white text-xs font-medium rounded-lg hover:bg-neutral-800 disabled:opacity-50 cursor-pointer"
          >
            {isPending ? 'Adding...' : 'Add Video'}
          </button>
        </div>
      </form>

      {/* Video list with reordering */}
      <div className="space-y-2.5">
        {videos.map((video, index) => {
          if (editingId === video.id) {
            return (
              <div key={video.id} className="bg-white border-2 border-neutral-900 rounded-xl p-3.5 space-y-2.5 shadow-xs">
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full px-3 py-1.5 text-sm border border-neutral-200 rounded-lg"
                />
                <input
                  type="text"
                  value={editYoutubeUrl}
                  onChange={(e) => setEditYoutubeUrl(e.target.value)}
                  className="w-full px-3 py-1.5 text-sm border border-neutral-200 rounded-lg"
                />
                <textarea
                  rows={3}
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="w-full px-3 py-1.5 text-sm border border-neutral-200 rounded-lg"
                />
                <div className="flex justify-end gap-1.5">
                  <button
                    type="button"
                    onClick={() => setEditingId(null)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-xs border border-neutral-200 rounded-lg cursor-pointer hover:bg-neutral-50"
                  >
                    <X className="w-3 h-3" /> Cancel
                  </button>
                  <button
                    type="button"
                    disabled={isPending}
                    onClick={() => handleSaveEdit(video.id)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-xs bg-neutral-900 text-white rounded-lg cursor-pointer hover:bg-neutral-800 font-medium"
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
              className="bg-white border border-neutral-200/80 rounded-xl p-3 sm:p-3.5 flex items-start justify-between gap-3 shadow-2xs hover:border-neutral-300 transition-colors"
            >
              {/* Reorder controls */}
              <div className="flex flex-col items-center gap-0.5 shrink-0 pt-0.5">
                <button
                  type="button"
                  disabled={index === 0 || isPending}
                  onClick={() => moveVideo(index, 'up')}
                  className="p-1 text-neutral-400 hover:text-neutral-900 disabled:opacity-20 cursor-pointer disabled:cursor-default"
                  title="Move Up"
                >
                  <ChevronUp className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  disabled={index === videos.length - 1 || isPending}
                  onClick={() => moveVideo(index, 'down')}
                  className="p-1 text-neutral-400 hover:text-neutral-900 disabled:opacity-20 cursor-pointer disabled:cursor-default"
                  title="Move Down"
                >
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>

              {/* Video Info */}
              <div className="space-y-0.5 min-w-0 flex-1">
                <h3 className="font-medium text-sm text-neutral-900 truncate">{video.title}</h3>
                <p className="text-xs text-neutral-400 font-mono truncate">{video.youtubeUrl}</p>
                {video.description && (
                  <p className="text-xs text-neutral-600 line-clamp-2 mt-1 leading-relaxed">{video.description}</p>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1 shrink-0 pt-0.5">
                <button
                  onClick={() => startEdit(video)}
                  className="p-1.5 text-neutral-400 hover:text-neutral-900 rounded-md hover:bg-neutral-100 transition-colors cursor-pointer"
                  title="Edit"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(video.id)}
                  className="p-1.5 text-neutral-400 hover:text-red-600 rounded-md hover:bg-red-50 transition-colors cursor-pointer"
                  title="Delete"
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
