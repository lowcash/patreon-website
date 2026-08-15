import { getVideos } from '@/app/actions/videos'
import AdminClient from './admin-client'

export const dynamic = 'force-dynamic'

export default async function AdminPage() {
  const videos = await getVideos()

  return (
    <div className="space-y-8">
      <AdminClient initialVideos={videos} />
    </div>
  )
}
