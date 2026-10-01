import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function requireAdmin() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) redirect('/')

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  })

  if (!user?.isAdmin) redirect('/')
  return user
}
