import { getVideos } from './actions/videos'
import { getYouTubeEmbedUrl } from '@/lib/youtube'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const videos = await getVideos()

  if (videos.length === 0) {
    return (
      <div className="text-center py-24 text-sm text-neutral-400">
        No videos yet.
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {videos.map((video) => {
        const embedUrl = getYouTubeEmbedUrl(video.youtubeUrl)

        return (
          <article key={video.id} className="space-y-2.5">
            <div className="aspect-video w-full bg-black rounded-lg overflow-hidden">
              {embedUrl ? (
                <iframe
                  src={embedUrl}
                  title={video.title}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-neutral-500 text-xs">
                  Invalid URL
                </div>
              )}
            </div>

            <div className="space-y-1">
              <h2 className="font-medium text-base text-neutral-900">
                {video.title}
              </h2>
              {video.description && (
                <p className="text-sm text-neutral-600 whitespace-pre-line leading-relaxed">
                  {video.description}
                </p>
              )}
            </div>
          </article>
        )
      })}
    </div>
  )
}
