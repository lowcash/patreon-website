import { getVideos } from './actions/videos'
import { getYouTubeEmbedUrl } from '@/lib/youtube'
import VideoDescription from './components/video-description'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const videos = await getVideos()

  if (videos.length === 0) {
    return (
      <div className="text-center py-24 text-xs text-neutral-400">
        No videos published yet.
      </div>
    )
  }

  return (
    <div className="space-y-8 sm:space-y-10">
      {videos.map((video) => {
        const embedUrl = getYouTubeEmbedUrl(video.youtubeUrl)

        return (
          <article
            key={video.id}
            className="bg-white border border-neutral-200/80 rounded-xl overflow-hidden shadow-2xs space-y-3 p-3 sm:p-4"
          >
            <div className="aspect-video w-full bg-neutral-900 rounded-lg overflow-hidden">
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
                  Invalid Video URL
                </div>
              )}
            </div>

            <div className="space-y-1 px-1">
              <h2 className="font-semibold text-base sm:text-lg text-neutral-900 leading-snug">
                {video.title}
              </h2>
              <VideoDescription description={video.description} />
            </div>
          </article>
        )
      })}
    </div>
  )
}
