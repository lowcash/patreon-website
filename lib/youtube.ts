export function getYouTubeEmbedUrl(url: string): string | null {
  if (!url) return null

  // Clean trimmed url
  const trimmed = url.trim()

  // Match common YouTube URL formats:
  // https://www.youtube.com/watch?v=VIDEO_ID
  // https://youtu.be/VIDEO_ID
  // https://www.youtube.com/embed/VIDEO_ID
  // https://www.youtube.com/shorts/VIDEO_ID
  const regExp = /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/
  const match = trimmed.match(regExp)

  if (match && match[1]) {
    return `https://www.youtube.com/embed/${match[1]}`
  }

  // If already an embed url or standard url that couldn't regex, check if raw ID was passed
  if (/^[\w-]{11}$/.test(trimmed)) {
    return `https://www.youtube.com/embed/${trimmed}`
  }

  return null
}
