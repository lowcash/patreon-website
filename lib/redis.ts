import { Redis } from '@upstash/redis'
import { Video } from './types'

const REDIS_KEY = 'videos'

const redis =
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
    ? new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL,
        token: process.env.UPSTASH_REDIS_REST_TOKEN,
      })
    : null

export async function fetchVideos(): Promise<Video[]> {
  try {
    if (!redis) return []
    const data = await redis.get<Video[] | string>(REDIS_KEY)
    if (!data) return []
    return typeof data === 'string' ? JSON.parse(data) : data
  } catch (err) {
    console.error('Error fetching videos from Upstash Redis:', err)
    return []
  }
}

export async function saveVideos(videos: Video[]): Promise<void> {
  try {
    if (!redis) return
    await redis.set(REDIS_KEY, videos)
  } catch (err) {
    console.error('Error saving videos to Upstash Redis:', err)
  }
}
