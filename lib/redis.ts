import { createClient } from 'redis'
import { Video } from './types'

const REDIS_KEY = 'videos'
const redisUrl = process.env.REDIS_URL || process.env.KV_URL

let client: ReturnType<typeof createClient> | null = null

async function getClient() {
  if (!redisUrl) return null

  if (!client) {
    try {
      client = createClient({
        url: redisUrl,
        socket: {
          reconnectStrategy: (retries) => (retries > 2 ? false : 500),
        },
      })
      client.on('error', () => {})
      await client.connect()
    } catch {
      client = null
      return null
    }
  }
  return client
}

export async function fetchVideos(): Promise<Video[]> {
  try {
    const redis = await getClient()
    if (!redis) return []
    const raw = await redis.get(REDIS_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export async function saveVideos(videos: Video[]): Promise<void> {
  try {
    const redis = await getClient()
    if (redis) {
      await redis.set(REDIS_KEY, JSON.stringify(videos))
    }
  } catch (err) {
    console.error('Failed to save to Redis:', err)
  }
}
