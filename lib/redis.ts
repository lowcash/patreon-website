import { Redis } from '@upstash/redis'
import { Video } from './types'

const REDIS_KEY = 'videos'

function getRedisClient(): Redis | null {
  const url =
    process.env.UPSTASH_REDIS_REST_URL ||
    process.env.KV_REST_API_URL

  const token =
    process.env.UPSTASH_REDIS_REST_TOKEN ||
    process.env.KV_REST_API_TOKEN

  if (!url || !token) {
    return null
  }

  return new Redis({ url, token })
}

export async function fetchVideos(): Promise<Video[]> {
  try {
    const redis = getRedisClient()
    if (!redis) {
      console.warn('Upstash Redis not configured. Return empty array.')
      return []
    }
    const data = await redis.get<Video[] | string>(REDIS_KEY)
    if (!data) return []
    return typeof data === 'string' ? JSON.parse(data) : data
  } catch (err) {
    console.error('Error reading from Upstash Redis:', err)
    return []
  }
}

export async function saveVideos(videos: Video[]): Promise<void> {
  const redis = getRedisClient()
  if (!redis) {
    throw new Error('Upstash Redis credentials missing. Set UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN in environment variables.')
  }
  await redis.set(REDIS_KEY, videos)
}
