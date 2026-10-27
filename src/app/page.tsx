import { prisma } from '@/lib/prisma'
import HomePage from './home-page'

export const dynamic = 'force-dynamic'

export default async function Home() {
  const webinars = await prisma.webinar.findMany({ orderBy: { startsAt: 'desc' } })
  return (
    <HomePage
      webinars={webinars.map((webinar) => ({
        id: webinar.id,
        title: webinar.title,
        description: webinar.description,
        image: webinar.image,
        signUpUrl: webinar.signUpUrl,
        startsAt: webinar.startsAt.toISOString(),
      }))}
    />
  )
}
