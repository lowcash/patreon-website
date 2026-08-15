'use server'

import { revalidatePath } from 'next/cache'
import { fetchVideos, saveVideos } from '@/lib/redis'
import { Video } from '@/lib/types'

export async function getVideos(): Promise<Video[]> {
  return await fetchVideos()
}

export async function createVideo(formData: {
  title: string
  description: string
  youtubeUrl: string
}): Promise<{ success: boolean; video?: Video; error?: string }> {
  try {
    const { title, description, youtubeUrl } = formData
    if (!title?.trim() || !youtubeUrl?.trim()) {
      return { success: false, error: 'Title and YouTube URL are required' }
    }

    const videos = await fetchVideos()
    const newVideo: Video = {
      id: 'vid_' + Date.now(),
      title: title.trim(),
      description: description?.trim() || '',
      youtubeUrl: youtubeUrl.trim(),
      createdAt: new Date().toISOString(),
    }

    videos.unshift(newVideo)
    await saveVideos(videos)

    revalidatePath('/')
    revalidatePath('/admin')
    return { success: true, video: newVideo }
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to save video' }
  }
}

export async function updateVideo(
  id: string,
  formData: { title: string; description: string; youtubeUrl: string }
): Promise<{ success: boolean; error?: string }> {
  try {
    const { title, description, youtubeUrl } = formData
    const videos = await fetchVideos()
    const index = videos.findIndex((v) => v.id === id)
    if (index === -1) return { success: false, error: 'Video not found' }

    videos[index] = {
      ...videos[index],
      title: title.trim(),
      description: description?.trim() || '',
      youtubeUrl: youtubeUrl.trim(),
    }

    await saveVideos(videos)
    revalidatePath('/')
    revalidatePath('/admin')
    return { success: true }
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to update video' }
  }
}

export async function deleteVideo(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    const videos = await fetchVideos()
    await saveVideos(videos.filter((v) => v.id !== id))
    revalidatePath('/')
    revalidatePath('/admin')
    return { success: true }
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to delete video' }
  }
}

export async function saveReorderedVideos(videos: Video[]): Promise<{ success: boolean; error?: string }> {
  try {
    await saveVideos(videos)
    revalidatePath('/')
    revalidatePath('/admin')
    return { success: true }
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to reorder videos' }
  }
}
